import * as exec from '@actions/exec'
import * as Github from '@actions/github'
import { ExecOptions } from '@actions/exec/lib/interfaces'

import { ConfigOptions } from '../../typings/domain-types'
import { OperationStatus } from '../../typings/enum-types'

import { boxenLogs, errorLogs, logs } from '../utils/loggers'

import { valueError } from '../errors/errors'

type RebaseArgs = {
    email: string
    username: string
    sourceBranch: string
    targetBranch: string
}

const execOptions = {
    listeners: {
        stdout: (data: Buffer): void => {
            logs(data.toString())
        },
        stderr: (data: Buffer): void => {
            logs(data.toString())
        },
    },
}

const git = async (args: string[], options: ExecOptions = execOptions): Promise<number> => {
    return exec.exec('git', args, options)
}

const rebase = async (args: RebaseArgs): Promise<void> => {
    await git(['config', '--local', 'user.name', args.username])
    await git(['config', '--local', 'user.email', args.email])

    await git(['fetch', '--all'])
    await git(['checkout', args.targetBranch])

    await git(['merge', '--ff-only', args.sourceBranch])
    await git(['push', 'origin', `${args.targetBranch}`])
}

export default async function mergeFastForwardOperation(options: ConfigOptions): Promise<OperationStatus> {
    boxenLogs(`Executing operation with options: ${options}`)

    const { GITHUB_REPOSITORY = '', GITHUB_TOKEN } = process.env

    const ghClient = GITHUB_TOKEN && new Github.GitHub(GITHUB_TOKEN)

    const [owner] = GITHUB_REPOSITORY.split('/')

    if (!ghClient) throw valueError('Failed to load Github client from token.')

    const {
        data: { email },
    } = await ghClient.users.getByUsername({ username: owner })

    try {
        await rebase({
            email,
            username: owner,
            sourceBranch: options.sourceBranch,
            targetBranch: options.targetBranch,
        })

        return Promise.resolve(OperationStatus.fail)
    } catch (error) {
        errorLogs(error.message)

        return Promise.reject(OperationStatus.fail)
    }
}

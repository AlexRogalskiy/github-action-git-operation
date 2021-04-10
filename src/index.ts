import * as core from '@actions/core'

import { ConfigOptions } from '../typings/domain-types'
import { OperationMode, OperationStatus } from '../typings/enum-types'

import { getOperation } from './routes/routes'

import { getRequiredProperty } from './utils/properties'
import { valueError } from './errors/errors'

const buildConfigOptions = (): ConfigOptions => {
    const sourceBranch = getRequiredProperty('sourceBranch')
    const targetBranch = getRequiredProperty('targetBranch')

    const mode = OperationMode[getRequiredProperty('mode')]

    return {
        sourceBranch,
        targetBranch,
        mode,
    }
}

const executeOperation = async (): Promise<OperationStatus> => {
    const options = buildConfigOptions()
    const operation = getOperation(options.mode)

    if (!operation) {
        throw valueError(`Invalid operation mode: ${options.mode}`)
    }

    return await operation(options)
}

export default async function run(): Promise<void> {
    try {
        const status = await executeOperation()

        core.setOutput('changed', status)
    } catch (error) {
        core.setFailed(`Cannot process operation, message: ${error.message}`)
    }
}

void run()

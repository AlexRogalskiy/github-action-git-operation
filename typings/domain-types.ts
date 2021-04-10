import boxen from 'boxen'

import { OperationMode } from './enum-types'

/**
 * ProfileOptions
 * @desc Type representing profiles options
 */
export type ProfileOptions = {
    /**
     * Output options
     */
    readonly outputOptions?: boxen.Options
}
//--------------------------------------------------------------------------------------------------
/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    /**
     * Source branch to merge from
     */
    readonly sourceBranch: string
    /**
     * Target branch to merge to
     */
    readonly targetBranch: string
    /**
     * Supported operation modes
     */
    readonly mode: OperationMode
}
//--------------------------------------------------------------------------------------------------

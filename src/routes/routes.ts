import { OperationFunction } from '../../typings/service-types'
import { OperationMode } from '../../typings/enum-types'
import { Optional } from '../../typings/standard-types'

import mergeFastForwardOperation from '../operations/merge-fast-forward.operation'

/**
 * OperationType
 * @desc Type representing supported operations
 */
export type OperationType = Record<OperationMode, OperationFunction>

/**
 * Route mappings
 * @desc Type representing supported route mappings
 */
const routes: Readonly<OperationType> = {
    [OperationMode.merge_ff]: mergeFastForwardOperation,
}

/**
 * Returns {@link OperationFunction} by input {@link OperationMode} value
 * @param value initial input {@link OperationMode} to fetch by
 */
export const getOperation = (value: Optional<OperationMode>): Optional<OperationFunction> => {
    return value ? routes[value] : null
}

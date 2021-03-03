
import { middleware as circuitBoardMiddleware } from '../../modules/CircuitBoard'

export const middleware = [
  circuitBoardMiddleware.selectNodeMiddleware,
]

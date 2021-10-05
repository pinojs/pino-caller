// Type definitions for pino-caller 3.1
// Project: https://github.com/pinojs/pino-caller#readme
// Definitions by: Austin Ziegler <https://github.com/halostatue>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Logger } from 'pino';

interface Options {
    relativeTo?: string;
}

declare function pinoCaller(logger: Logger, options?: Options): Logger;

export default pinoCaller
export { pinoCaller }
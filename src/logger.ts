export const writeError = (message: string, error?: Error, data?: {}) => {
    console.error(
        JSON.stringify({
            message,
            level: 'error',
            data: {
                error: error
                    ? {
                          message: error.message,
                          stack: error.stack,
                      }
                    : {},
                ...data,
            },
        })
    );
};

export const writeWarning = (message: string, data?: {}, error?: Error) => {
    console.warn(
        JSON.stringify({
            message,
            level: 'warning',
            data: {
                error: error
                    ? {
                          message: error.message,
                          stack: error.stack,
                      }
                    : {},
                ...data,
            },
        })
    );
};

export const writeInfo = (message: string, data?: {}) => {
    console.info(
        JSON.stringify({
            message,
            level: 'info',
            data,
        })
    );
};

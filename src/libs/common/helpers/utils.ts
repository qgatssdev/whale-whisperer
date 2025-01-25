import {
  BadRequestException,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';

const handleDbErrors = (err) => {
  //foreign key voiation error
  if (err.number === 547) {
    // Handle foreign key violation error here
    throw new BadRequestException('Invalid Foreign Key');
  }
  //duplicate value
  else if (err.number === 2627 || err.number === 2601) {
    throw new BadRequestException('DB duplicate error value already exists');
  }
};

export const handleErrorCatch = (err) => {
  console.log(err);
  const logger = new Logger();
  logger.error(err);
  // console.log(err)
  handleDbErrors(err);

  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED ||
    err.status === HttpStatus.FORBIDDEN ||
    err.status === HttpStatus.CONFLICT
  ) {
    throw new HttpException(
      {
        status: err.status,
        message: err.response.message || err.response.error,
        error: err.response.error,
      },
      err.status,
    );
  }

  const message = err.message;

  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `An error occured with the message: ${err.message}`,
      message: message,
      errorType: 'Internal server error',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

export const decodeBase64Image = (
  base64String: string,
): { buffer: Buffer; mimetype: string } => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const mimetype = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  return { buffer, mimetype };
};

export const convertToHighestCurrencyDenomination = (
  amount: number,
): number => {
  return amount / 100;
};

export const convertToLowestCurrencyDenomination = (amount: number): number => {
  return amount * 100;
};

export const generateOTP = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

import { BadRequestException, Logger } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { HttpException, HttpStatus } from '@nestjs/common';

export class AppValidationError {
  type: string;
  statusCode: number;
  path: string;
  msg: string;
  validations: { [property: string]: string[] | any; } | any;
}


export class ApiError extends HttpException {
  msg?: string;
  type?: string;
  body?: any;
  constructor(msg?: string, param?: { body?: any, code: HttpStatus }) {
    super({ msg, body: param?.body }, param?.code ?? HttpStatus.UNPROCESSABLE_ENTITY);
    this.msg = msg;
    this.body = param?.body;
  }
}

export class ApiErrorNotFound extends ApiError {
  constructor(msg: string, body?: any) {
    super();
    this.msg = msg;
    this.body = body;
  }
}

export class ApiErrorNotFoundEntity extends ApiError {
  constructor(entity: string) {

    super(`Entity ${entity} requested not found`);
  }
}

export class ApiErrorCreation extends ApiError {
  constructor(entity?: string) {
    super(`Unable to save data for ${entity}. Check your data and tray agin or contact admin if that persist`);
  }
}

export class ApiErrorUpdate extends ApiError {
  constructor(entity?: string) {
    super(`Unable to update data for ${entity}. Check your data and tray agin or contact admin if that persist`);
  }
}


export class ApiErrorDelete extends ApiError {
  constructor(entity?: string) {
    super(`Unable to remove data for ${entity}. Check your data and tray agin or contact admin if that persist`);
  }
}


export class ApiErrorTypeOrm extends ApiError {
  constructor(entity: string) {

    super(`An error occurred during processing request (${entity}). Check your data and tray agin or contact admin if that persist`);
  }
}

export const errorMapper = (errors: ValidationError[]) => {
  const iError: AppValidationError = new AppValidationError();
  iError.type = "VALIDATION";
  iError.statusCode = 400;
  iError.msg = "Les données ne sont pas celles espérées";
  iError.validations = {};

  errors.forEach((error) => {
    if (error.children && error.children.length > 0) {
      iError.validations[error.property] = {};
      error.children.forEach((ele) => {
        if (ele.constraints) {
          iError.validations[error.property][ele.property] = Object.values(ele.constraints)
        }
      })
    }
    if (error.constraints)
      iError.validations[error.property] = Object.values(error.constraints);
  });
  return new BadRequestException(iError);
}
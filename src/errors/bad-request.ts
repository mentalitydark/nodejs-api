import express from "express"
import { StatusCodes } from "http-status-codes";

import { AbstractError } from "./abstract-error";
import { IErrorProps } from "./abstract-error-types";

export class BadRequest extends AbstractError {
  public constructor(res: express.Response, props: IErrorProps, error?: Object) {
    super(res, { ...props, status: StatusCodes.BAD_REQUEST}, error)
  }
}
import express from "express"
import { StatusCodes } from "http-status-codes";

import { AbstractError } from "./abstract-error";
import { IErrorProps } from "./abstract-error-types";

export class NotFound extends AbstractError {
  public constructor(res: express.Response, props: IErrorProps, error?: Object) {
    super(res, { ...props, status: StatusCodes.NOT_FOUND}, error)
  }
}
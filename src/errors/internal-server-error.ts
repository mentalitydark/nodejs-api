import express from "express"
import { StatusCodes } from "http-status-codes";

import { AbstractError } from "./abstract-error";

export class InternalServerError extends AbstractError {
  public constructor(res: express.Response, err?: Error) {
    super(res, {
      title: "Internal Server Error",
      detail: err ? err.message : null,
      status: StatusCodes.INTERNAL_SERVER_ERROR
    }, {})
  }
}
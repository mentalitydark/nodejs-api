import express from "express"
import { StatusCodes } from "http-status-codes"
import { IErrorProps } from "./abstract-error-types"

interface IErrorPropsWithStatus extends IErrorProps {
  status: StatusCodes
}

export abstract class AbstractError {
  response: express.Response
  title: string
  status: StatusCodes
  detail?: string
  type?: string
  instance?: string
  error?: Object

  public constructor(response: express.Response, {title, status, detail, type, instance}: IErrorPropsWithStatus, error?: Object) {
    this.response = response

    this.title = title
    this.status = status
    this.detail = detail
    this.type = type
    this.instance = instance
    this.error = error

    this.send()
  }

  private send() {
    return this.response.type('application/problem+json').status(this.status).json({
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
      error: this.error
    }).end()
  }

}
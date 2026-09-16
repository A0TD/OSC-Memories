import { Request, Response, NextFunction } from "express";
import { DeleteMediaRequest } from "../models/deleteMediaRequest.model";
import AppError from "../utils/appError.util";

export const getAllDeletionRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requests = await DeleteMediaRequest.find();

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved all requests",
      requests,
    });
  } catch (err) {
    next(err);
  }
};

export const createDeletionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { mediaId }: any = req.params;
    const { reason } = req.body;
    const requestedBy = (req as any).user.id;

    const alreadyReported = await DeleteMediaRequest.find({
      mediaId,
      requestedBy,
    });

    if (alreadyReported) throw new AppError(400, "You already filed a report");

    const request = await DeleteMediaRequest.create({
      requestedBy,
      mediaId,
      reason,
    });

    return res.status(201).send({
      success: true,
      message: "Request created successfully!",
      request,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { requestId } = req.params;
    const requestedBy = (req as any).user.id;

    const request = await DeleteMediaRequest.findOneAndDelete({
      _id: requestId,
      requestedBy,
    });

    if (!request) throw new AppError(404, "Request not found!");

    return res.status(200).send({
      success: true,
      message: "Request cancelled successfully!",
    });
  } catch (err) {
    next(err);
  }
};

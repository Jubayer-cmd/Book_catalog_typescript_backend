import { Request, RequestHandler, Response } from "express";

import { User } from "@prisma/client";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";
import { authService } from "./auth.service";

// signup
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;

    const result = await authService.createUserService(userData);
    let dataWithoutPass;
    if (result) {
      const { password, ...rest } = result;
      dataWithoutPass = rest;
    }
    sendResponse<Omit<User, "password">>(res, {
      success: true,
      statusCode: 200,
      message: "User created successfully !",
      data: dataWithoutPass,
    });
  }
);
// login
const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await authService.loginUserService(userData);
    const { refreshToken, ...others } = result;
    // set refresh token into cookie

    const cookieOptions = {
      secure: true,
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    sendResponse<ILoginUserResponse>(res, {
      success: true,
      statusCode: 200,
      message: "User signin successfully!",
      data: others,
    });
  }
);

const getRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authService.getRefreshTokenService(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "New access token generated successfully !",
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
  getRefreshToken,
};

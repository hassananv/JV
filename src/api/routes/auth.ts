import { Express, NextFunction, Request, Response } from "express";
import * as ExpressSession from "express-session";
import { AuthUser } from "../models/auth";
import { AUTH_REDIRECT, FRONTEND_URL, BASE_URL } from "../config";

import { UserService } from "../services";
const userService = new UserService();

const { auth } = require("express-openid-connect");

export function configureAuthentication(app: Express) {
  app.use(
    ExpressSession.default({
      secret: "supersecret",
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(
    auth({
      authRequired: false,
      auth0Logout: false,
      authorizationParams: {
        response_type: "code",
        audience: "",
        scope: "openid profile email"
      },
      routes: {
        login: "/api/auth/login",
        //logout: "/api/auth/logout",
        postLogoutRedirect: FRONTEND_URL
      }
    })
  );

  app.use("/", async (req: Request, res: Response, next: NextFunction) => {
    if (req.oidc.isAuthenticated()) {
      req.user = AuthUser.fromOpenId(req.oidc.user);
      (req.session as any).user = req.user;
    }

    next();
  });

  app.get("/api/auth/login", (req, res) =>
    res.oidc.login({
      returnTo: "/api/auth/profile",
      authorizationParams: {
        redirect_uri: BASE_URL + "/callback"
      }
    })
  );

  app.get("/api/auth/profile", async (req, res) => {
    if (req.oidc.isAuthenticated()) {
      const authUser = AuthUser.fromOpenId(req.oidc.user);
      await userService.createOrUpdate(authUser);
    }
    res.redirect("/");
  });

  app.get("/api/auth/user_info", async (req, res) => {
    if (req.oidc.isAuthenticated()) {
      const authUserEmail = req.user.email;
      await userService
        .getByEmail(authUserEmail)
        .then(resp => {
          res.status(200).json(resp);
        })
        .catch(() => res.status(401).json("Not Authorized"));
    }
    return res.status(401).send();
  });

  app.get("/", async (req: Request, res: Response) => {
    if (req.oidc.isAuthenticated()) {
      let user = AuthUser.fromOpenId(req.oidc.user) as AuthUser;
      req.user = user;

      res.redirect(AUTH_REDIRECT);
    } else {
      // this is hard-coded to accomodate strage behaving in sendFile not allowing `../` in the path.
      // this won't hit in development because web access is served by the Vue CLI - only an issue in Docker
      res.sendFile("/home/node/app/dist/web/index.html");
    }
  });

  app.get("/api/auth/isAuthenticated", (req: Request, res: Response) => {
    if (req.oidc.isAuthenticated()) {
      return res.send({ data: req.user });
    }

    return res.status(401).send();
  });

  app.get("/api/auth/logout", async (req: any, res) => {
    req.session.destroy();
    res.status(401);
    await (res as any).oidc.logout();
  });
}

export function EnsureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.oidc.isAuthenticated()) {
    return next();
  }

  res.status(401).send("Not authenticated"); //;.redirect('/api/auth/login');
}

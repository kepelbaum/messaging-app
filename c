[33mcommit 66a6d1f4f982d8b7d0bfb920929422634c23086c[m
Author: Kirill Epelbaum <150293425+kepelbaum@users.noreply.github.com>
Date:   Sun Aug 4 21:23:16 2024 -0400

    fix: users.js backend test complete

[1mdiff --git a/backend/src/routes/user.js b/backend/src/routes/user.js[m
[1mindex 3e500ac..1befbc1 100644[m
[1m--- a/backend/src/routes/user.js[m
[1m+++ b/backend/src/routes/user.js[m
[36m@@ -12,9 +12,9 @@[m [mrouter.get("/", async (req, res) => {[m
 [m
 router.get("/:user", async (req, res) => {[m
   const user = await req.context.models.Messenger.findOne({[m
[31m-    username: user,[m
[32m+[m[32m    username: req.params.user,[m
   }).select("-password");[m
[31m-  return res.send(user); //revisit for hiding chats[m
[32m+[m[32m  return res.json({ result: user }); //revisit for hiding chats[m
 });[m
 [m
 router.post([m
[36m@@ -64,7 +64,7 @@[m [mrouter.post([m
 );[m
 [m
 router.put([m
[31m-  "/:userId",[m
[32m+[m[32m  "/",[m
   body("password")[m
     .isLength({ min: 5 })[m
     .withMessage("Password has to be at least 5 symbols long"),[m
[36m@@ -87,15 +87,9 @@[m [mrouter.put([m
               username: authData.user.username,[m
               password: authData.user.password,[m
             });[m
[31m-            const use = await req.context.models.Messenger.findById([m
[31m-              req.params.userId,[m
[31m-            );[m
[31m-            if ([m
[31m-              acc.username === use.username &&[m
[31m-              acc.password === use.password[m
[31m-            ) {[m
[32m+[m[32m            if (acc) {[m
               const user = await req.context.models.Messenger.findByIdAndUpdate([m
[31m-                req.params.userId,[m
[32m+[m[32m                acc._id,[m
                 {[m
                   password: req.body.password,[m
                   friends: req.body.friends,[m
[36m@@ -103,7 +97,7 @@[m [mrouter.put([m
                   displayName: req.body.displayName,[m
                 },[m
               );[m
[31m-              return res.json({ message: "Password updated" });[m
[32m+[m[32m              return res.json({ message: "Settings updated" });[m
             } else {[m
               res.sendStatus(401);[m
             }[m

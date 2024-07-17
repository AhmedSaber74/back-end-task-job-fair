import joi from "joi";


export const updateUserValidation = {
  body: joi.object({
    username: joi.string(),
    email: joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }),
    password: joi.string(),
    role: joi.string(),
  }),
  headers: joi
    .object({
      _id: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),

};

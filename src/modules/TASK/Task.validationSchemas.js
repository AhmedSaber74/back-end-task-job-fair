import joi from "joi";

export const addTaskValidation = {
  body: joi.object({
    title: joi.string().required() ,
    body: joi.string(),
    Status:joi.string().required(),
    type:joi.string().required(),
    listItems:joi.array()
  }),

  headers: joi
    .object({
      _id: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),

    params: joi
    .object({
        categoryId: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),

};

export const updateTaskValidation = {
  body: joi.object({
    title: joi.string() ,
    body: joi.string(),
    Status:joi.string(),
    type:joi.string(),
    listItems:joi.array()
  }),
  headers: joi
    .object({
      _id: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),

    query: joi
    .object({
        categoryId: joi.string().hex().length(24),
        taskId: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),
};


export const deleteTASkValidation = {
  query: joi
    .object({
      taskId: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),
};

export const getTaskValidationBYId = {
    query: joi
    .object({
      taskId: joi.string().hex().length(24),
    })
    .options({ allowUnknown: true }),
};

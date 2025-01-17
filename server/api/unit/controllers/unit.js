'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async update(ctx) {
    const { id } = ctx.params;

    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'Unit.update.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 6)
      return ctx.badRequest('Invalid number of params!', {
        id: 'Unit.update.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const {
      grade: gradeId,
      name,
      number,
      standards_id,
      standards_description,
      classrooms
    } = ctx.request.body;
    if (
      !strapi.services.validator.isPositiveInt(number) ||
      !strapi.services.validator.isPositiveInt(gradeId) ||
      !standards_id ||
      !name ||
      !standards_description ||
      !classrooms
    )
      return ctx.badRequest(
        'A grade, name, standards_description must be provided! Number and Standards_id must be positive interger! A classroom list array must be provided!',
        { id: 'Unit.update.body.invalid', error: 'ValidationError' }
      );

    // ensure the grade is valid
    const grade = await strapi.services.grade.findOne({ id: gradeId });
    if (!grade)
      return ctx.notFound('The grade provided is invalid!', {
        id: 'Unit.update.grade.invalid',
        error: 'ValidationError',
      });

    return await strapi.services.unit.update({ id }, ctx.request.body);
  },
};

import validate from "mongoose-validator";
import { Typegoose, prop, index } from "typegoose";

@index({ name: "text" })
export class Request extends Typegoose {
  @prop()
  private name?: string;

  @prop({
    validate: [
      validate({
        validator: "isMobilePhone",
        message: "Not a valid phone number",
        arguments: ["any", true]
      })
    ]
  })
  private phoneNumber?: string;
}

export var RequestModel = new Request().getModelForClass(Request, {
  schemaOptions: { timestamps: true }
});

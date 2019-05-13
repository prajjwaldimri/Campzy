import mailjet from "node-mailjet";

const mailer = mailjet.connect(
  process.env.MAILJET_PUBLIC || "",
  process.env.MAILJET_PRIVATE || ""
);

import moment from "moment";
import { User } from "../models/user";
import { Token } from "../models/token";
import { Booking } from "../models/booking";
import { Camp } from "../models/camp";
import { Invoice } from "../models/invoice";

const sendEmailVerificationToken = async (
  email: string,
  token: string,
  name: string
): Promise<mailjet.Email.PostResponse> => {
  try {
    return await mailer.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "support@campzy.in",
            Name: "Campzy Support"
          },
          To: [
            {
              Email: email,
              Name: name
            }
          ],
          TemplateID: 690665,
          TemplateLanguage: true,
          Subject: "Welcome to Campzy.",
          Variables: {
            userName: name,
            // eslint-disable-next-line @typescript-eslint/camelcase
            confirmation_link: `https://campzy.in/emailVerification/${token}`
          }
        }
      ]
    });
  } catch (err) {
    return err;
  }
};

const sendResetPasswordToken = async (
  email: string,
  token: Token
): Promise<mailjet.Email.Response> => {
  try {
    return await mailer.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "support@campzy.in",
            Name: "Campzy"
          },
          To: [
            {
              Email: email
            }
          ],
          TemplateID: 514379,
          TemplateLanguage: true,
          Subject: "Password Reset Request at Campzy",
          Variables: {
            resetToken: token.tokenValue
          }
        }
      ]
    });
  } catch (err) {
    return err;
  }
};

const sendSuccessBookingEmail = async (
  booking: Booking,
  user: User,
  camp: Camp,
  amount: number
): Promise<mailjet.Email.Response> => {
  try {
    return await mailer.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "bookings@campzy.in",
            Name: "Campzy"
          },
          To: [
            {
              Email: user.email,
              Name: user.name
            }
          ],
          TemplateID: 553951,
          TemplateLanguage: true,
          Subject: "Booking Successful",
          Variables: {
            userName: user.name,
            campName: camp.name,
            campPhone: camp.phoneNumber,
            bookingId: booking.code,
            fromDate: moment(booking.startDate).format("dddd, MMMM Do YYYY"),
            toDate: moment(booking.endDate).format("dddd, MMMM Do YYYY"),
            bookingCost: amount
          }
        }
      ]
    });
  } catch (err) {
    return err;
  }
};

const sendCampOwnerBill = async (
  booking: Booking,
  camp: Camp,
  transferAmount: TransferAmount,
  invoice: Invoice
): Promise<mailjet.Email.Response> => {
  try {
    return await mailer.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "bookings@campzy.in",
            Name: "Campzy"
          },
          To: [
            {
              Email: camp.email,
              Name: camp.ownerId.name
            }
          ],
          TemplateID: 559117,
          TemplateLanguage: true,
          Subject: "Tax Invoice",
          Variables: {
            date: moment().format("dddd, MMMM Do YYYY"),
            invoiceNumber: invoice.invoiceNumber,
            campName: camp.name,
            campLocation: camp.location,
            bookingCode: booking.code,
            // Divide by 100 as the amount is in paise and we need it in INR
            serviceCharge: transferAmount.commissionAmount / 100,
            gst: transferAmount.tax / 100,
            totalAmount:
              transferAmount.commissionAmount / 100 + transferAmount.tax / 100
          }
        }
      ]
    });
  } catch (err) {
    return err;
  }
};

const sendBookingCancelUser = async (
  user: User
): Promise<mailjet.Email.Response> => {
  try {
    return await mailer.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "bookings@campzy.in",
            Name: "Campzy"
          },
          To: [
            {
              Email: user.email,
              Name: user.name
            }
          ],
          TemplateID: 563051,
          TemplateLanguage: true,
          Subject: "Tax Invoice",
          Variables: {
            userName: user.name
          }
        }
      ]
    });
  } catch (err) {
    return err;
  }
};

export var emailer = {
  sendEmailVerificationToken,
  sendResetPasswordToken,
  sendSuccessBookingEmail,
  sendCampOwnerBill,
  sendBookingCancelUser
};

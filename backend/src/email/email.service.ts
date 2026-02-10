import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendOrderConfirmation(email: string, orderId: string, totalAmount: number) {
    const html = `
      <h2>Order Confirmed!</h2>
      <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
      <p><strong>Total Amount:</strong> ₦${totalAmount.toLocaleString()}</p>
      <p>You will receive updates on your order status soon.</p>
      <p><a href="${process.env.FRONTEND_URL}/orders/${orderId}">View Order</a></p>
    `;

    return this.sendMail(email, 'Order Confirmation', html);
  }

  async sendPaymentSuccess(email: string, orderId: string, reference: string) {
    const html = `
      <h2>Payment Successful! 🎉</h2>
      <p>Your payment for order <strong>#${orderId}</strong> has been processed successfully.</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p>Vendors will start preparing your order.</p>
      <p><a href="${process.env.FRONTEND_URL}/orders/${orderId}">Track Order</a></p>
    `;

    return this.sendMail(email, 'Payment Successful', html);
  }

  async sendPaymentFailed(email: string, orderId: string) {
    const html = `
      <h2>Payment Failed</h2>
      <p>Unfortunately, your payment for order <strong>#${orderId}</strong> could not be processed.</p>
      <p>Please try again or contact support.</p>
      <p><a href="${process.env.FRONTEND_URL}/checkout">Retry Payment</a></p>
    `;

    return this.sendMail(email, 'Payment Failed', html);
  }

  async sendOrderReady(email: string, orderId: string) {
    const html = `
      <h2>Your Order is Ready!</h2>
      <p>Order <strong>#${orderId}</strong> is now ready for pickup or delivery.</p>
      <p>Please check your dashboard for details.</p>
      <p><a href="${process.env.FRONTEND_URL}/orders/${orderId}">View Order</a></p>
    `;

    return this.sendMail(email, 'Order Ready', html);
  }

  async sendVendorApproved(email: string, businessName: string) {
    const html = `
      <h2>Vendor Account Approved! 🎉</h2>
      <p>Congratulations <strong>${businessName}</strong>!</p>
      <p>Your vendor account has been approved and is now active.</p>
      <p>You can now add products and start receiving orders.</p>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/vendor">Go to Dashboard</a></p>
    `;

    return this.sendMail(email, 'Vendor Account Approved', html);
  }

  private async sendMail(to: string, subject: string, html: string) {
    try {
      return await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
}

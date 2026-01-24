'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function TermsPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: January 15, 2024</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Secufur Smart Solutions website and services, you accept and agree to be bound by
              the terms and provisions of this agreement. If you do not agree to these terms, please do not
              use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Services</h2>
            <p>
              Secufur Smart Solutions provides an online platform for purchasing batteries, electronics, and customized
              power solutions. Our services include product browsing, ordering, customization, and customer
              support.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Account Registration</h2>
            <p>
              To access certain features of our services, you may be required to create an account.
              You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password confidential and secure</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Products and Pricing</h2>
            <p>
              All products displayed on our website are subject to availability. We reserve the right to:
            </p>
            <ul>
              <li>Limit the quantity of products available for purchase</li>
              <li>Discontinue any product at any time</li>
              <li>Refuse any order at our sole discretion</li>
              <li>Correct any errors in pricing or product information</li>
            </ul>
            <p>
              Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless
              otherwise stated. Shipping charges may apply based on delivery location.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Customized Products</h2>
            <p>
              For customized battery products:
            </p>
            <ul>
              <li>Customization specifications must be confirmed before manufacturing begins</li>
              <li>Manufacturing times are estimates and may vary based on complexity</li>
              <li>Customized products cannot be returned unless defective</li>
              <li>Additional charges may apply for non-standard configurations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Payment Terms</h2>
            <p>
              We accept various payment methods including credit cards, debit cards, UPI, net banking,
              and EMI options through our authorized payment partners. All payments are processed
              securely through encrypted connections.
            </p>
            <p>
              By making a payment, you represent that you are authorized to use the payment method
              and that the information you provide is accurate.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Shipping and Delivery</h2>
            <p>
              Delivery times and charges vary based on location and product type. We will make
              reasonable efforts to deliver products within the estimated timeframe, but delays
              may occur due to factors beyond our control.
            </p>
            <p>
              Risk of loss and title for products pass to you upon delivery to the carrier.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Returns and Refunds</h2>
            <p>
              Our return and refund policies are detailed in our{' '}
              <Link href="/buyer/return-policy">Return Policy</Link>. Please review this policy before
              making a purchase.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Warranty</h2>
            <p>
              Product warranties are provided as specified in our{' '}
              <Link href="/buyer/warranty">Warranty Policy</Link>. Warranty terms vary by product
              category and are subject to the conditions outlined in that policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software,
              is the property of Secufur Smart Solutions or its content suppliers and is protected by intellectual
              property laws. You may not reproduce, distribute, or create derivative works without
              our prior written consent.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Secufur Smart Solutions shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of or related to
              your use of our services or products.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Secufur Smart Solutions and its officers, directors, employees,
              and agents from any claims, damages, losses, or expenses arising out of your use of our
              services or violation of these terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting on this page. Your continued use of our services after
              changes are posted constitutes your acceptance of the modified terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction
              of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section className={styles.section}>
            <h2>15. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: legal@secufur.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: Secufur Smart Solutions, 123 Industrial Area, Sector 18, Gurugram, Haryana 122015, India</p>
            </div>
          </section>
        </div>

        <div className={styles.navigation}>
          <Link href="/buyer/privacy">Privacy Policy</Link>
          <Link href="/buyer/return-policy">Return Policy</Link>
          <Link href="/buyer/warranty">Warranty</Link>
        </div>
      </div>
    </div>
  );
}

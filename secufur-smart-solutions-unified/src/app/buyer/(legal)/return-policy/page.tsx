'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function ReturnPolicyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Return Policy</h1>
          <p className={styles.lastUpdated}>Last updated: January 15, 2024</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Overview</h2>
            <p>
              At LUVARTE, we want you to be completely satisfied with your purchase. If you&apos;re not
              happy with your order, we&apos;re here to help. This Return Policy outlines the conditions
              under which you can return products and receive a refund or exchange.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Return Window</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Category</th>
                  <th>Return Window</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard Batteries</td>
                  <td>30 days</td>
                  <td>Unused, original packaging</td>
                </tr>
                <tr>
                  <td>Electronics & Inverters</td>
                  <td>15 days</td>
                  <td>Unused, original packaging</td>
                </tr>
                <tr>
                  <td>Customized Products</td>
                  <td>Not returnable*</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>Accessories</td>
                  <td>30 days</td>
                  <td>Unused, original packaging</td>
                </tr>
              </tbody>
            </table>
            <p>*Customized products can only be returned if they are defective or don&apos;t meet the agreed specifications.</p>
          </section>

          <section className={styles.section}>
            <h2>Eligibility for Returns</h2>
            <p>To be eligible for a return, the following conditions must be met:</p>
            <ul>
              <li>Product is within the return window from the delivery date</li>
              <li>Product is unused and in its original condition</li>
              <li>Original packaging, tags, and accessories are intact</li>
              <li>You have the original invoice or order confirmation</li>
              <li>Product is not damaged due to misuse or improper handling</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Non-Returnable Items</h2>
            <p>The following items cannot be returned:</p>
            <ul>
              <li>Customized or made-to-order products (unless defective)</li>
              <li>Products that have been installed or used</li>
              <li>Items marked as &quot;Final Sale&quot; or &quot;Non-Returnable&quot;</li>
              <li>Products damaged due to misuse, negligence, or accident</li>
              <li>Items without original packaging or accessories</li>
              <li>Gift cards and digital products</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Initiate a Return</h2>
            <ol>
              <li>
                <strong>Log in to your account</strong> and go to &quot;My Orders&quot;
              </li>
              <li>
                <strong>Select the order</strong> containing the item you wish to return
              </li>
              <li>
                <strong>Click &quot;Return/Replace&quot;</strong> and select the item(s)
              </li>
              <li>
                <strong>Choose your reason</strong> for the return
              </li>
              <li>
                <strong>Select your preferred resolution</strong> (refund or exchange)
              </li>
              <li>
                <strong>Schedule a pickup</strong> or drop off at a designated location
              </li>
            </ol>
            <p>
              Alternatively, contact our customer support at support@luvarte.com or call
              +91 1800 123 4567.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Return Shipping</h2>
            <ul>
              <li>
                <strong>Defective products:</strong> Free return shipping
              </li>
              <li>
                <strong>Wrong product delivered:</strong> Free return shipping
              </li>
              <li>
                <strong>Change of mind:</strong> Return shipping charges apply (deducted from refund)
              </li>
            </ul>
            <p>
              We will arrange pickup from your registered address. Please ensure the product is
              securely packed to prevent damage during transit.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Refund Process</h2>
            <p>Once we receive and inspect the returned product:</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Refund Method</th>
                  <th>Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Original Payment Method</td>
                  <td>5-7 business days</td>
                </tr>
                <tr>
                  <td>LUVARTE Store Credit</td>
                  <td>24-48 hours</td>
                </tr>
                <tr>
                  <td>Bank Transfer</td>
                  <td>7-10 business days</td>
                </tr>
              </tbody>
            </table>
            <p>
              Please note that your bank or card issuer may take additional time to process
              the refund to your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Exchanges</h2>
            <p>
              If you wish to exchange a product for a different size, color, or model:
            </p>
            <ul>
              <li>Exchange is subject to product availability</li>
              <li>Price differences will be charged or refunded accordingly</li>
              <li>Same eligibility criteria as returns apply</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Defective Products</h2>
            <p>
              If you receive a defective product:
            </p>
            <ul>
              <li>Report within 48 hours of delivery for immediate replacement</li>
              <li>Take photos/videos of the defect as evidence</li>
              <li>Do not use or install the product</li>
              <li>We will arrange free pickup and provide a replacement or full refund</li>
            </ul>
            <div className={styles.warningBox}>
              <h4>Important</h4>
              <p>
                Products damaged during installation or due to improper use are not covered
                under the return policy. Please ensure proper handling and follow installation
                guidelines.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              For any questions regarding returns, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: returns@luvarte.com</p>
              <p>Phone: +91 1800 123 4567</p>
              <p>Working Hours: Mon-Sat, 9:00 AM - 7:00 PM IST</p>
            </div>
          </section>
        </div>

        <div className={styles.navigation}>
          <Link href="/buyer/warranty">Warranty</Link>
          <Link href="/buyer/terms">Terms of Service</Link>
          <Link href="/buyer/contact">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}

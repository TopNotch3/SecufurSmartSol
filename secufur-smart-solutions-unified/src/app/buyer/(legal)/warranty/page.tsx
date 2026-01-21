'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function WarrantyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Warranty Policy</h1>
          <p className={styles.lastUpdated}>Last updated: January 15, 2024</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Warranty Coverage</h2>
            <p>
              LUVARTE stands behind the quality of our products. We offer comprehensive warranty
              coverage on all our batteries and electronics to give you peace of mind with your
              purchase.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Warranty Periods</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Category</th>
                  <th>Warranty Period</th>
                  <th>Coverage Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lithium Ion Batteries</td>
                  <td>5 Years</td>
                  <td>Manufacturing Defects</td>
                </tr>
                <tr>
                  <td>Lead Acid Batteries</td>
                  <td>2 Years</td>
                  <td>Manufacturing Defects</td>
                </tr>
                <tr>
                  <td>Customized Battery Packs</td>
                  <td>3 Years</td>
                  <td>Manufacturing Defects</td>
                </tr>
                <tr>
                  <td>Inverters</td>
                  <td>2 Years</td>
                  <td>Manufacturing Defects</td>
                </tr>
                <tr>
                  <td>Solar Controllers</td>
                  <td>2 Years</td>
                  <td>Manufacturing Defects</td>
                </tr>
                <tr>
                  <td>Accessories</td>
                  <td>1 Year</td>
                  <td>Manufacturing Defects</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2>What&apos;s Covered</h2>
            <p>Our warranty covers:</p>
            <ul>
              <li>Manufacturing defects in materials and workmanship</li>
              <li>Battery cells not meeting rated capacity within warranty period</li>
              <li>Electronic component failures under normal use</li>
              <li>BMS (Battery Management System) malfunctions</li>
              <li>Software/firmware issues (for smart products)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>What&apos;s Not Covered</h2>
            <p>The warranty does not cover:</p>
            <ul>
              <li>Damage from misuse, abuse, or negligence</li>
              <li>Damage from improper installation or handling</li>
              <li>Normal wear and tear</li>
              <li>Damage from water, fire, or natural disasters</li>
              <li>Unauthorized modifications or repairs</li>
              <li>Use with incompatible equipment or chargers</li>
              <li>Damage from electrical surges or improper voltage</li>
              <li>Cosmetic damage that doesn&apos;t affect functionality</li>
              <li>Products with removed or altered serial numbers</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Battery-Specific Warranty Terms</h2>
            <div className={styles.infoBox}>
              <h4>Capacity Guarantee</h4>
              <p>
                Our lithium batteries are guaranteed to maintain at least 80% of their rated
                capacity throughout the warranty period under normal usage conditions
                (up to 500 charge cycles per year).
              </p>
            </div>
            <p>Battery warranty is void if:</p>
            <ul>
              <li>Battery is discharged below minimum voltage repeatedly</li>
              <li>Battery is charged with non-compatible chargers</li>
              <li>Battery is exposed to temperatures outside operating range</li>
              <li>Battery casing is opened or tampered with</li>
              <li>Battery is used in applications not recommended by manufacturer</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Claim Warranty</h2>
            <ol>
              <li>
                <strong>Register your product</strong> within 30 days of purchase on our website
                or by emailing your invoice to warranty@luvarte.com
              </li>
              <li>
                <strong>Contact support</strong> with your order number, product serial number,
                and description of the issue
              </li>
              <li>
                <strong>Provide documentation</strong> including photos/videos of the defect
                and proof of purchase
              </li>
              <li>
                <strong>Diagnostic assessment</strong> - our technical team will evaluate the claim
              </li>
              <li>
                <strong>Resolution</strong> - approved claims will be repaired, replaced, or refunded
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Warranty Service Options</h2>
            <p>Depending on the product and issue, we offer:</p>
            <ul>
              <li>
                <strong>Repair:</strong> Free repair at our authorized service centers
              </li>
              <li>
                <strong>Replacement:</strong> New or refurbished product of equal or greater value
              </li>
              <li>
                <strong>On-site Service:</strong> For eligible products, technician visit at your location
              </li>
              <li>
                <strong>Refund:</strong> In cases where repair or replacement is not possible
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Extended Warranty</h2>
            <p>
              We offer extended warranty plans that can be purchased at the time of product
              purchase or within 30 days of delivery:
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Additional Coverage</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bronze</td>
                  <td>+1 Year</td>
                  <td>5% of product price</td>
                </tr>
                <tr>
                  <td>Silver</td>
                  <td>+2 Years</td>
                  <td>8% of product price</td>
                </tr>
                <tr>
                  <td>Gold</td>
                  <td>+3 Years + Accidental Damage</td>
                  <td>12% of product price</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2>Authorized Service Centers</h2>
            <p>
              Warranty service must be performed by LUVARTE or our authorized service partners.
              Service performed by unauthorized third parties will void the warranty.
            </p>
            <p>
              Find your nearest authorized service center by visiting our{' '}
              <Link href="/buyer/contact">Contact Us</Link> page or calling our support line.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Warranty Support</h2>
            <div className={styles.contactInfo}>
              <p>Email: warranty@luvarte.com</p>
              <p>Phone: +91 1800 123 4567 (Extension 2)</p>
              <p>Working Hours: Mon-Sat, 9:00 AM - 7:00 PM IST</p>
            </div>
          </section>
        </div>

        <div className={styles.navigation}>
          <Link href="/buyer/return-policy">Return Policy</Link>
          <Link href="/buyer/battery-safety">Battery Safety</Link>
          <Link href="/buyer/terms">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

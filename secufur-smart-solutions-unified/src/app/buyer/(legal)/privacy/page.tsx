'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: January 15, 2024</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              LUVARTE Energy Solutions (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website and use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide, including:</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Account credentials</li>
              <li>Order history and preferences</li>
              <li>Communication records when you contact us</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data</li>
              <li>Browsing behavior and page views</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>Processing and fulfilling your orders</li>
              <li>Managing your account and providing customer support</li>
              <li>Sending order confirmations and shipping updates</li>
              <li>Personalizing your shopping experience</li>
              <li>Sending promotional communications (with your consent)</li>
              <li>Improving our website and services</li>
              <li>Detecting and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third parties who help us operate our business
                (payment processors, shipping partners, analytics providers)
              </li>
              <li>
                <strong>Business Partners:</strong> For joint marketing initiatives (with your consent)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience. For detailed
              information, please see our <Link href="/buyer/cookie-policy">Cookie Policy</Link>.
            </p>
            <p>You can control cookies through your browser settings, but disabling them may affect
              website functionality.</p>
          </section>

          <section className={styles.section}>
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information, including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure payment processing (PCI DSS compliant)</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this policy, comply with legal obligations, resolve disputes, and enforce
              our agreements. Typically:
            </p>
            <ul>
              <li>Account information: Until account deletion or 3 years of inactivity</li>
              <li>Order data: 7 years for tax and legal compliance</li>
              <li>Marketing preferences: Until you opt out</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Your Rights</h2>
            <p>Subject to applicable law, you have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@luvarte.com.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not
              knowingly collect personal information from children. If we learn that we have
              collected data from a child, we will take steps to delete it promptly.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the privacy practices of these sites. We encourage you to read their privacy policies
              before providing any personal information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              Your continued use of our services after changes are posted constitutes acceptance of
              the modified policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p>Data Protection Officer</p>
              <p>Email: privacy@luvarte.com</p>
              <p>Phone: +91 1800 123 4567</p>
              <p>Address: LUVARTE Energy Solutions, 123 Industrial Area, Sector 5, Mumbai, Maharashtra 400001</p>
            </div>
          </section>
        </div>

        <div className={styles.navigation}>
          <Link href="/buyer/terms">Terms of Service</Link>
          <Link href="/buyer/cookie-policy">Cookie Policy</Link>
          <Link href="/buyer/return-policy">Return Policy</Link>
        </div>
      </div>
    </div>
  );
}

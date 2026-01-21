'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function CookiePolicyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Cookie Policy</h1>
          <p className={styles.lastUpdated}>Last updated: January 15, 2024</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website.
              They are widely used to make websites work more efficiently and provide information
              to website owners. Cookies help us enhance your browsing experience and provide
              personalized services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Types of Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic
              features like page navigation, secure login, and shopping cart functionality.
              The website cannot function properly without these cookies.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>session_id</td>
                  <td>Maintains user session</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>csrf_token</td>
                  <td>Security - prevents cross-site request forgery</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>cart_items</td>
                  <td>Stores shopping cart contents</td>
                  <td>30 days</td>
                </tr>
              </tbody>
            </table>

            <h3>Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as remembering
              your preferences and language settings.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>user_preferences</td>
                  <td>Stores user preferences</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>language</td>
                  <td>Remembers language preference</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>recent_views</td>
                  <td>Recently viewed products</td>
                  <td>30 days</td>
                </tr>
              </tbody>
            </table>

            <h3>Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting
              and reporting information anonymously. This helps us improve our website.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics - distinguishes users</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics - distinguishes users</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>_gat</td>
                  <td>Google Analytics - throttles request rate</td>
                  <td>1 minute</td>
                </tr>
              </tbody>
            </table>

            <h3>Marketing Cookies</h3>
            <p>
              These cookies track your online activity to help advertisers deliver more relevant
              advertising or to limit how many times you see an ad. They may be set by us or
              by third-party providers.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_fbp</td>
                  <td>Facebook Pixel - ad targeting</td>
                  <td>3 months</td>
                </tr>
                <tr>
                  <td>ads_session</td>
                  <td>Ad campaign tracking</td>
                  <td>Session</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We use
              services from:
            </p>
            <ul>
              <li>Google Analytics - for website analytics</li>
              <li>Facebook - for social media integration and advertising</li>
              <li>Payment providers - for secure payment processing</li>
              <li>Customer support tools - for chat and support functionality</li>
            </ul>
            <p>
              These third parties may use cookies, web beacons, and similar technologies to
              collect or receive information from our website. Please refer to their respective
              privacy policies for more information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Managing Cookies</h2>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <h3>Browser Settings</h3>
            <p>
              Most browsers allow you to control cookies through their settings. You can:
            </p>
            <ul>
              <li>View what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set preferences for specific websites</li>
            </ul>
            <p>
              Please note that blocking all cookies may impact your experience on our website
              and limit certain functionality.
            </p>

            <h3>Browser-Specific Instructions</h3>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>

            <h3>Opt-Out Links</h3>
            <p>You can opt out of specific cookie-based tracking:</p>
            <ul>
              <li>Google Analytics: tools.google.com/dlpage/gaoptout</li>
              <li>Facebook: facebook.com/settings/?tab=ads</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Cookie Consent</h2>
            <p>
              When you first visit our website, you will see a cookie consent banner that allows
              you to accept or customize your cookie preferences. You can change your preferences
              at any time by clicking the &quot;Cookie Settings&quot; link in our website footer.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology,
              legislation, or our data practices. We encourage you to periodically review this
              page for the latest information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: privacy@luvarte.com</p>
              <p>Phone: +91 1800 123 4567</p>
            </div>
          </section>
        </div>

        <div className={styles.navigation}>
          <Link href="/buyer/privacy">Privacy Policy</Link>
          <Link href="/buyer/terms">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function BatterySafetyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Battery Safety Guidelines</h1>
          <p className={styles.lastUpdated}>Last updated: January 15, 2024</p>
        </div>

        <div className={styles.content}>
          <div className={styles.warningBox}>
            <h4>Important Safety Information</h4>
            <p>
              Please read these safety guidelines carefully before using any battery product.
              Improper handling or use of batteries can result in fire, explosion, personal injury,
              or property damage.
            </p>
          </div>

          <section className={styles.section}>
            <h2>General Battery Safety</h2>
            <ul>
              <li>Always read and follow the product manual before use</li>
              <li>Use only chargers and accessories recommended by LUVARTE</li>
              <li>Keep batteries away from children and pets</li>
              <li>Do not expose batteries to extreme temperatures</li>
              <li>Do not puncture, crush, or disassemble batteries</li>
              <li>Do not short-circuit battery terminals</li>
              <li>Inspect batteries regularly for damage or swelling</li>
              <li>Dispose of batteries properly according to local regulations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Lithium Ion Battery Safety</h2>
            <h3>Do&apos;s</h3>
            <ul>
              <li>Store in a cool, dry place at 40-60% charge for long-term storage</li>
              <li>Use a Battery Management System (BMS) for protection</li>
              <li>Allow batteries to cool before charging after heavy use</li>
              <li>Use appropriate protective equipment when handling</li>
              <li>Keep a fire extinguisher (Class D) nearby when charging</li>
              <li>Charge in a well-ventilated area on a non-flammable surface</li>
            </ul>

            <h3>Don&apos;ts</h3>
            <ul>
              <li>Don&apos;t charge below 0°C or above 45°C</li>
              <li>Don&apos;t discharge below minimum voltage (typically 2.5V per cell)</li>
              <li>Don&apos;t overcharge above maximum voltage (typically 4.2V per cell)</li>
              <li>Don&apos;t leave charging batteries unattended overnight</li>
              <li>Don&apos;t use damaged, swollen, or leaking batteries</li>
              <li>Don&apos;t mix batteries of different ages, capacities, or chemistries</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Installation Guidelines</h2>
            <p>
              Proper installation is crucial for battery safety and longevity:
            </p>
            <ol>
              <li>
                <strong>Location:</strong> Install in a well-ventilated area away from heat sources,
                direct sunlight, and moisture
              </li>
              <li>
                <strong>Surface:</strong> Place on a stable, level, non-flammable surface
              </li>
              <li>
                <strong>Connections:</strong> Ensure all connections are tight and properly insulated
              </li>
              <li>
                <strong>Polarity:</strong> Double-check positive and negative connections before powering on
              </li>
              <li>
                <strong>Fusing:</strong> Install appropriate fuses or circuit breakers for protection
              </li>
              <li>
                <strong>Ventilation:</strong> Maintain adequate clearance around the battery for airflow
              </li>
            </ol>
            <div className={styles.infoBox}>
              <h4>Professional Installation Recommended</h4>
              <p>
                For high-capacity battery systems (above 100Ah), we strongly recommend professional
                installation by a certified technician. Contact our support team for authorized
                installer referrals in your area.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Operating Conditions</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Recommended Range</th>
                  <th>Maximum Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Charging Temperature</td>
                  <td>15°C to 35°C</td>
                  <td>0°C to 45°C</td>
                </tr>
                <tr>
                  <td>Discharging Temperature</td>
                  <td>10°C to 40°C</td>
                  <td>-10°C to 55°C</td>
                </tr>
                <tr>
                  <td>Storage Temperature</td>
                  <td>15°C to 25°C</td>
                  <td>-20°C to 45°C</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>40% to 60% RH</td>
                  <td>10% to 90% RH</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2>Warning Signs</h2>
            <p>Stop using the battery immediately and contact support if you notice:</p>
            <ul>
              <li>Swelling or bulging of the battery case</li>
              <li>Unusual heat generation during use or charging</li>
              <li>Smoke, sparks, or flames</li>
              <li>Strong chemical or burning smell</li>
              <li>Leaking electrolyte or other fluids</li>
              <li>Abnormal noises (hissing, crackling)</li>
              <li>Significant reduction in capacity or runtime</li>
              <li>Physical damage to the casing or terminals</li>
            </ul>
            <div className={styles.warningBox}>
              <h4>Emergency Procedure</h4>
              <p>
                If a battery catches fire: Evacuate the area immediately. Do not attempt to
                extinguish with water. Use a Class D fire extinguisher or sand. Call emergency
                services (fire department) immediately.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Transportation</h2>
            <p>When transporting batteries:</p>
            <ul>
              <li>Package securely to prevent movement and short circuits</li>
              <li>Keep terminals protected and insulated</li>
              <li>Do not ship fully charged (charge to 30-50%)</li>
              <li>Follow shipping regulations (IATA, ADR for hazardous goods)</li>
              <li>Declare as dangerous goods when shipping by air</li>
              <li>Keep away from metal objects and conductive materials</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Storage</h2>
            <p>For extended storage periods:</p>
            <ul>
              <li>Charge to 40-60% capacity before storage</li>
              <li>Store in a cool, dry location (15-25°C ideal)</li>
              <li>Disconnect from all equipment</li>
              <li>Check charge level every 3 months and recharge if needed</li>
              <li>Do not stack heavy items on batteries</li>
              <li>Keep away from flammable materials</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Disposal and Recycling</h2>
            <p>
              Batteries contain materials that can be harmful to the environment. Please dispose
              of them responsibly:
            </p>
            <ul>
              <li>Never dispose of batteries in regular household waste</li>
              <li>Contact your local recycling center for battery disposal options</li>
              <li>LUVARTE offers a battery take-back program - contact us for details</li>
              <li>Ensure batteries are fully discharged before disposal</li>
              <li>Tape over terminals to prevent short circuits during transport</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Product-Specific Safety</h2>
            <p>
              Each LUVARTE product comes with detailed safety instructions specific to that model.
              Always refer to the product manual for complete safety information. Product manuals
              can also be downloaded from your order history page.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Safety Certifications</h2>
            <p>All LUVARTE batteries are certified to meet or exceed:</p>
            <ul>
              <li>BIS (Bureau of Indian Standards) certification</li>
              <li>UN 38.3 transportation testing</li>
              <li>IEC 62133 safety standards</li>
              <li>CE marking (for applicable products)</li>
              <li>RoHS compliance</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Contact for Safety Concerns</h2>
            <p>
              If you have any safety concerns or questions about our products, please contact
              our technical support team immediately:
            </p>
            <div className={styles.contactInfo}>
              <p>Safety Hotline: +91 1800 123 4567 (Press 1 for emergencies)</p>
              <p>Email: safety@luvarte.com</p>
              <p>Available 24/7 for safety emergencies</p>
            </div>
          </section>
        </div>

        <div className={styles.navigation}>
          <Link href="/buyer/warranty">Warranty</Link>
          <Link href="/buyer/help">Help Center</Link>
          <Link href="/buyer/contact">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}

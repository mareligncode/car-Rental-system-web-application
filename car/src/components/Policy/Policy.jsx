import React from 'react';
import { Link } from 'react-router-dom';
import './Policy.css'
const Policy = () => {
  return (
    <div className="privacy-policy-container bg-body-secondary">
      <h1>Privacy Policy for car Rental Ethiopia</h1>
      <p>
        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
      </p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to car Rental Ethiopia. We are committed to protecting your personal information and your right to privacy. [4] This Privacy Policy outlines our policies and procedures on the collection, use, and disclosure of your information when you use our car rental services. [3]
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us. [1, 2]
        </p>
        <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
        <ul>
          <li>
            <strong>Personal Identification Information:</strong> Name, gender, date of birth, and contact details (email address, phone number, physical address). [5]
          </li>
          <li>
            <strong>Payment Information:</strong> Credit card details and billing address. [4]
          </li>
          <li>
            <strong>Rental Information:</strong> Details of your car rental, including  dates, type of vehicle, and preferences. [8]
          </li>
          <li>
            <strong>Vehicle Usage Data:</strong> We may collect information about the vehicle's usage, including mileage, fuel consumption, and accident history, for our legitimate business interests. [1]
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect or receive:</p>
        <ul>
          <li>
            <strong>To facilitate account creation and logon process.</strong>
          </li>
          <li>
            <strong>To send you marketing and promotional communications.</strong> You may opt-out of our marketing emails at any time.
          </li>
          <li>
            <strong>To send administrative information to you.</strong> We may use your personal information to send you product, service, and new feature information and/or information about changes to our terms, conditions, and policies.
          </li>
          <li>
            <strong>To fulfill and manage your rentals.</strong> We may use your information to fulfill and manage your rentals, payments, and returns. [2]
          </li>
          <li>
            <strong>For other Business Purposes.</strong> We may use your information for other business purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns, and to evaluate and improve our Website, products, marketing, and your experience.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Will Your Information Be Shared with Anyone?</h2>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.
             [8] Examples include: payment processing, data analysis, email delivery, hosting services, and customer service.
              [8] We may also share your information with our business partners to offer you certain products, services, or promotions. [6]</p>
      </section>

      <section>
        <h2>5. How We Keep Your Information Safe</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. [5] This includes using firewalls and Transport Layer Security 
          (TLS) encryption for financial information. [1] However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. [1]
        </p>
      </section>

      <section>
        <h2>6. Your Privacy Rights</h2>
        <p>
           you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
            In certain circumstances, you may also have the right to object to the processing of your personal information. [5]
        </p>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>
          If you have questions or comments about this policy, you may email us at <Link to="mailto:yimermarelign@gmail.com">yimermarelign@gmail.com</Link> or by post to:
        </p>
        <p>
        car Rent Ethiopia
          <br />
          Bahirdar,Ethiopia
        </p>
      </section>
    </div>
  );
};

export default Policy;
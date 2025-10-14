import { cn } from "@/lib/utils";
import React from "react";
import {
  LegalBullitLi,
  LegalBullitList,
  MainLegalHeader,
  RegularLegalHeader,
  RegularLegalParagraph,
} from "./Legal";

export function PrivacyPolicy() {
  return (
    <div className="max-w-[800px] flex flex-col gap-10 px-6">
      <MainLegalHeader updateDate="Sep 30, 2025" tag="Legal Document">
        Privacy Policy
      </MainLegalHeader>
      <section className="space-y-0">
        <LegalBullitList
          description={`This Privacy Notice for FluentFlow LLC ("we," "us," or "our"), describes
          how and why we might access, collect, store, use, and/or share
          (&apos;process&apos;) your personal information when you use our services
        (&apos;Services&apos;), including when you:`}
        >
          <LegalBullitLi>
            Visit our website at https://fluentflow.space or any website of ours
            that links to this Privacy Notice
          </LegalBullitLi>
          <LegalBullitLi>
            Use FluentFlow. An innovative platform designed to enhance IELTS
            Speaking skills through advanced AI simulations. Offering
            personalized, interactive practice sessions, it helps users build
            confidence, improve fluency, and master natural conversation for
            exam success.
          </LegalBullitLi>
          <LegalBullitLi>
            Engage with us in other related ways, including any sales,
            marketing, or events
          </LegalBullitLi>
        </LegalBullitList>
        <RegularLegalParagraph>
          Questions or concerns? Reading this Privacy Notice will help you
          understand your privacy rights and choices. We are responsible for
          making decisions about how your personal information is processed. If
          you do not agree with our policies and practices, please do not use
          our Services. If you still have any questions or concerns, please
          contact us at info@istai.space.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          In this paragraph we are gonna be needing this stuff you know
        </RegularLegalParagraph>
      </section>
      <section className="space-y-4">
        <RegularLegalHeader className="">
          SUMMARY OF KEY POINTS
        </RegularLegalHeader>
        <RegularLegalParagraph className="italic font-semibold text-gray-600">
          This summary provides key points from our Privacy Notice, but you can
          find out more details about any of these topics by clicking the link
          following each key point or by using our table of contents below to
          find the section you are looking for.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          This summary provides key points from our Privacy Notice, but you can
          find out more details about any of these topics by clicking the link
          following each key point or by using our table of contents below to
          find the section you are looking for.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Do we process any sensitive personal information? Some of the
          information may be considered "special" or "sensitive" in certain
          jurisdictions, for example your racial or ethnic origins, sexual
          orientation, and religious beliefs. We do not process sensitive
          personal information.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Do we collect any information from third parties? We do not collect
          any information from third parties.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          How do we process your information? We process your information to
          provide, improve, and administer our Services, communicate with you,
          for security and fraud prevention, and to comply with law. We may also
          process your information for other purposes with your consent. We
          process your information only when we have a valid legal reason to do
          so. Learn more about how we process your information.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          In what situations and with which parties do we share personal
          information? We may share information in specific situations and with
          specific third parties. Learn more about when and with whom we share
          your personal information.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          How do we keep your information safe? We have adequate organizational
          and technical processes and procedures in place to protect your
          personal information. However, no electronic transmission over the
          internet or information storage technology can be guaranteed to be
          100% secure, so we cannot promise or guarantee that hackers,
          cybercriminals, or other unauthorized third parties will not be able
          to defeat our security and improperly collect, access, steal, or
          modify your information. Learn more about how we keep your information
          safe.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          What are your rights? Depending on where you are located
          geographically, the applicable privacy law may mean you have certain
          rights regarding your personal information. Learn more about your
          privacy rights.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          How do you exercise your rights? The easiest way to exercise your
          rights is by visiting https://fluentflow.space/dashboard/profile, or
          by contacting us. We will consider and act upon any request in
          accordance with applicable data protection laws.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Want to learn more about what we do with any information we
          collect? Review the Privacy Notice in full.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>TABLE OF CONTENTS</RegularLegalHeader>
        <LegalBullitList className="list-decimal">
          <LegalBullitLi className="uppercase">
            <a href="#information" className="link-legal">
              WHAT INFORMATION DO WE COLLECT
            </a>
          </LegalBullitLi>
          <LegalBullitLi className="uppercase">
            <a href="#process-information" className="link-legal">
              HOW DO WE PROCESS YOUR INFORMATION
            </a>
          </LegalBullitLi>
          <LegalBullitLi className="uppercase">
            <a href="#legal-bases" className="link-legal">
              What legal bases do we rely on to process your personal
              information?
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="#share-information" className="link-legal">
              WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </a>
          </LegalBullitLi>
          <LegalBullitLi className="uppercase">
            <a href="#cookies" className="link-legal">
              DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </a>
          </LegalBullitLi>
          <LegalBullitLi className="uppercase">
            <a href="#artificial-intelligence" className="link-legal">
              DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="#social-logins" className="link-legal">
              HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="#period-information" className="link-legal">
              HOW LONG DO WE KEEP YOUR INFORMATION?
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="#privacy-rights" className="link-legal">
              WHAT ARE YOUR PRIVACY RIGHTS?
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="#updates" className="link-legal">
              DO WE MAKE UPDATES TO THIS NOTICE?
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="#contact" className="link-legal">
              HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </a>
          </LegalBullitLi>
        </LegalBullitList>
      </section>
      <section id="information" className="space-y-0">
        <RegularLegalHeader>
          1. WHAT INFORMATION DO WE COLLECT?
        </RegularLegalHeader>
        <RegularLegalParagraph className="font-semibold text-base lg:text-lg text-gray-700">
          Personal information you disclose to use
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          In Short: We collect personal information that you provide to us.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We collect personal information that you voluntarily provide to us
          when you register on the Services, express an interest in obtaining
          information about us or our products and Services, when you
          participate in activities on the Services, or otherwise when you
          contact us.
        </RegularLegalParagraph>
        <LegalBullitList
          description={`Personal Information Provided by You.  The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:`}
        >
          <LegalBullitLi>names</LegalBullitLi>
          <LegalBullitLi>email adresses</LegalBullitLi>
          <LegalBullitLi>passwords</LegalBullitLi>
          <LegalBullitLi>debit/credit card numbers</LegalBullitLi>
        </LegalBullitList>
        <RegularLegalParagraph>
          spanSensitive Information. We do not process sensitive information.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Payment Data. We may collect data necessary to process your payment if
          you choose to make purchases, such as your payment instrument number,
          and the security code associated with your payment instrument. All
          payment data is handled and stored by Paddle. You may find their
          privacy notice link(s) here: https://www.paddle.com/legal/privacy.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Social Media Login Data. We may provide you with the option to
          register with us using your existing social media account details,
          like your Facebook, X, or other social media account. If you choose to
          register in this way, we will collect certain profile information
          about you from the social media provider, as described in the section
          called "HOW DO WE HANDLE YOUR SOCIAL LOGINS?" below.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          All personal information that you provide to us must be true,
          complete, and accurate, and you must notify us of any changes to such
          personal information.
        </RegularLegalParagraph>
        {/* <RegularLegalParagraph></RegularLegalParagraph> */}
      </section>
      <section className="space-y-0">
        <RegularLegalParagraph className="font-semibold text-base lg:text-lg text-gray-700">
          Information automatically collected
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          In Short: Some information — such as your Internet Protocol (IP)
          address and/or browser and device characteristics — is collected
          automatically when you visit our Services.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We automatically collect certain information when you visit, use, or
          navigate the Services. This information does not reveal your specific
          identity (like your name or contact information) but may include
          device and usage information, such as your IP address, browser and
          device characteristics, operating system, language preferences,
          referring URLs, device name, country, location, information about how
          and when you use our Services, and other technical information. This
          information is primarily needed to maintain the security and operation
          of our Services, and for our internal analytics and reporting
          purposes.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Like many businesses, we also collect information through cookies and
          similar technologies. You can find out more about this in our Cookie
          Notice: https://fluentflow.space/cookiespolicy.
        </RegularLegalParagraph>
        <LegalBullitList description="The information we collect includes:">
          <LegalBullitLi>
            Log and Usage Data. Log and usage data is service-related,
            diagnostic, usage, and performance information our servers
            automatically collect when you access or use our Services and which
            we record in log files. Depending on how you interact with us, this
            log data may include your IP address, device information, browser
            type, and settings and information about your activity in the
            Services (such as the date/time stamps associated with your usage,
            pages and files viewed, searches, and other actions you take such as
            which features you use), device event information (such as system
            activity, error reports (sometimes called "crash dumps"), and
            hardware settings).
          </LegalBullitLi>
        </LegalBullitList>
      </section>
      <section className="space-y-4" id="process-information">
        <RegularLegalHeader>
          2. HOW DO WE PROCESS YOUR INFORMATION?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: We process your information to provide, improve, and
          administer our Services, communicate with you, for security and fraud
          prevention, and to comply with law. We process the personal
          information for the following purposes listed below. We may also
          process your information for other purposes only with your prior
          explicit consent.
        </RegularLegalParagraph>
        <LegalBullitList description="We process your personal information for a variety of reasons, depending on how you interact with our Services, including:">
          <LegalBullitLi>
            To facilitate account creation and authentication and otherwise
            manage user accounts. We may process your information so you can
            create and log in to your account, as well as keep your account in
            working order.
          </LegalBullitLi>
          <LegalBullitLi>
            To request feedback. We may process your information when necessary
            to request feedback and to contact you about your use of our
            Services.
          </LegalBullitLi>
          <LegalBullitLi>
            To save or protect an individual's vital interest. We may process
            your information when necessary to save or protect an individual’s
            vital interest, such as to prevent harm.
          </LegalBullitLi>
        </LegalBullitList>
      </section>
      <section id="legal-bases">
        <RegularLegalHeader>
          3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: We only process your personal information when we believe it
          is necessary and we have a valid legal reason (i.e., legal basis) to
          do so under applicable law, like with your consent, to comply with
          laws, to provide you with services to enter into or fulfill our
          contractual obligations, to protect your rights, or to fulfill our
          legitimate business interests.
        </RegularLegalParagraph>
        <RegularLegalParagraph className="font-semibold underline italic">
          If you are located in the EU or UK, this section applies to you.
        </RegularLegalParagraph>
        <LegalBullitList description="The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information.  As such, we may rely on the following legal bases to process your personal information:">
          <LegalBullitLi>
            Consent. We may process your information if you have given us
            permission (i.e., consent) to use your personal information for a
            specific purpose. You can withdraw your consent at any time. Learn
            more about withdrawing your consent.
          </LegalBullitLi>
          <LegalBullitLi>
            Legitimate Interests. We may process your information when we
            believe it is reasonably necessary to achieve our legitimate
            business interests and those interests do not outweigh your
            interests and fundamental rights and freedoms. For example, we may
            process your personal information for some of the purposes described
            in order to:
          </LegalBullitLi>
          <LegalBullitLi>
            Understand how our users use our products and services so we can
            improve user experience
          </LegalBullitLi>
          <LegalBullitLi>
            Legal Obligations. We may process your information where we believe
            it is necessary for compliance with our legal obligations, such as
            to cooperate with a law enforcement body or regulatory agency,
            exercise or defend our legal rights, or disclose your information as
            evidence in litigation in which we are involved.
          </LegalBullitLi>
          <LegalBullitLi>
            Vital Interests. We may process your information where we believe it
            is necessary to protect your vital interests or the vital interests
            of a third party, such as situations involving potential threats to
            the safety of any person.
          </LegalBullitLi>
        </LegalBullitList>
      </section>
      <section className="share-information">
        <RegularLegalHeader>
          4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: We may share information in specific situations described in
          this section and/or with the following third parties.
        </RegularLegalParagraph>
        <LegalBullitList description="We may need to share your personal information in the following situations:">
          <LegalBullitLi>
            Business Transfers. We may share or transfer your information in
            connection with, or during negotiations of, any merger, sale of
            company assets, financing, or acquisition of all or a portion of our
            business to another company.
          </LegalBullitLi>
        </LegalBullitList>
      </section>
      <section className="cookies">
        <RegularLegalHeader>
          5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: We may use cookies and other tracking technologies to
          collect and store your information.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We may use cookies and similar tracking technologies (like web beacons
          and pixels) to gather information when you interact with our Services.
          Some online tracking technologies help us maintain the security of our
          Services and your account, prevent crashes, fix bugs, save your
          preferences, and assist with basic site functions.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We also permit third parties and service providers to use online
          tracking technologies on our Services for analytics and advertising,
          including to help manage and display advertisements, to tailor
          advertisements to your interests, or to send abandoned shopping cart
          reminders (depending on your communication preferences). The third
          parties and service providers use their technology to provide
          advertising about products and services tailored to your interests
          which may appear either on our Services or on other websites.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          To the extent these online tracking technologies are deemed to be a
          "sale"/"sharing" (which includes targeted advertising, as defined
          under the applicable laws) under applicable US state laws, you can opt
          out of these online tracking technologies by submitting a request as
          described below under section "DO UNITED STATES RESIDENTS HAVE
          SPECIFIC PRIVACY RIGHTS?"
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Specific information about how we use such technologies and how you
          can refuse certain cookies is set out in our Cookie Notice:
          https://fluentflow.space/cookiespolicy.
        </RegularLegalParagraph>
      </section>
      <section id="artificial-intelligence">
        <RegularLegalHeader>
          6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: We offer products, features, or tools powered by artificial
          intelligence, machine learning, or similar technologies.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          As part of our Services, we offer products, features, or tools powered
          by artificial intelligence, machine learning, or similar technologies
          (collectively, "AI Products"). These tools are designed to enhance
          your experience and provide you with innovative solutions. The terms
          in this Privacy Notice govern your use of the AI Products within our
          Services.
        </RegularLegalParagraph>
        <RegularLegalParagraph className="font-semibold text-base lg:text-lg text-gray-700">
          Use of AI Technologies
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We provide the AI Products through third-party service providers (&quot;AI
          Service Providers&quot;), including Groq, OpenAI and Microsoft Azure AI. As
          outlined in this Privacy Notice, your input, output, and personal
          information will be shared with and processed by these AI Service
          Providers to enable your use of our AI Products for purposes outlined
          in &quot;WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL
          INFORMATION?&quot; You must not use the AI Products in any way that
          violates the terms or policies of any AI Service Provider.
        </RegularLegalParagraph>
        <LegalBullitList description="Our AI products are designed for the following functions:">
          <LegalBullitLi>AI applications</LegalBullitLi>
          <LegalBullitLi>Text analysis</LegalBullitLi>
          <LegalBullitLi>Natural Language Processing</LegalBullitLi>
        </LegalBullitList>
        <RegularLegalParagraph className="font-semibold text-base lg:text-lg text-gray-700">
          How We Process Your Data Using AI
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          All personal information processed using our AI Products is handled in
          line with our Privacy Notice and our agreement with third parties.
          This ensures high security and safeguards your personal information
          throughout the process, giving you peace of mind about your data's
          safety.
        </RegularLegalParagraph>
      </section>
      <section id="social-logins">
        <RegularLegalHeader>
          7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: If you choose to register or log in to our Services using a
          social media account, we may have access to certain information about
          you.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Our Services offer you the ability to register and log in using your
          third-party social media account details (like your Facebook or X
          logins). Where you choose to do this, we will receive certain profile
          information about you from your social media provider. The profile
          information we receive may vary depending on the social media provider
          concerned, but will often include your name, email address, friends
          list, and profile picture, as well as other information you choose to
          make public on such a social media platform.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We will use the information we receive only for the purposes that are
          described in this Privacy Notice or that are otherwise made clear to
          you on the relevant Services. Please note that we do not control, and
          are not responsible for, other uses of your personal information by
          your third-party social media provider. We recommend that you review
          their privacy notice to understand how they collect, use, and share
          your personal information, and how you can set your privacy
          preferences on their sites and apps.
        </RegularLegalParagraph>
      </section>
      <section id="period-information">
        <RegularLegalHeader>
          8. HOW LONG DO WE KEEP YOUR INFORMATION?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: We keep your information for as long as necessary to fulfill
          the purposes outlined in this Privacy Notice unless otherwise required
          by law.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this Privacy Notice, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting, or other legal requirements). No purpose in this notice
          will require us keeping your personal information for longer than the
          period of time in which users have an account with us.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we will
          securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </RegularLegalParagraph>
      </section>
      <section id="privacy-rights">
        <RegularLegalHeader>
          9. WHAT ARE YOUR PRIVACY RIGHTS?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: Depending on your state of residence in the US or in some
          regions, such as the European Economic Area (EEA), United Kingdom
          (UK), Switzerland, and Canada, you have rights that allow you greater
          access to and control over your personal information. You may review,
          change, or terminate your account at any time, depending on your
          country, province, or state of residence.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          In some regions (like the EEA, UK, Switzerland, and Canada), you have
          certain rights under applicable data protection laws. These may
          include the right (i) to request access and obtain a copy of your
          personal information, (ii) to request rectification or erasure; (iii)
          to restrict the processing of your personal information; (iv) if
          applicable, to data portability; and (v) not to be subject to
          automated decision-making. If a decision that produces legal or
          similarly significant effects is made solely by automated means, we
          will inform you, explain the main factors, and offer a simple way to
          request human review. In certain circumstances, you may also have the
          right to object to the processing of your personal information. You
          can make such a request by contacting us by using the contact details
          provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"
          below.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We will consider and act upon any request in accordance with
          applicable data protection laws.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          If you are located in the EEA or UK and you believe we are unlawfully
          processing your personal information, you also have the right to
          complain to your Member State data protection authority or UK data
          protection authority.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          If you are located in Switzerland, you may contact the Federal Data
          Protection and Information Commissioner.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Withdrawing your consent: If we are relying on your consent to process
          your personal information, which may be express and/or implied consent
          depending on the applicable law, you have the right to withdraw your
          consent at any time. You can withdraw your consent at any time by
          contacting us by using the contact details provided in the section
          &quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot; below.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Withdrawing your consent: If we are relying on your consent to process
          your personal information, which may be express and/or implied consent
          depending on the applicable law, you have the right to withdraw your
          consent at any time. You can withdraw your consent at any time by
          contacting us by using the contact details provided in the section
          &quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot; below.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          However, please note that this will not affect the lawfulness of the
          processing before its withdrawal nor, when applicable law allows, will
          it affect the processing of your personal information conducted in
          reliance on lawful processing grounds other than consent.
        </RegularLegalParagraph>
        <RegularLegalParagraph className="font-semibold text-base lg:text-lg text-gray-700">
          Account Information
        </RegularLegalParagraph>
        <LegalBullitList description="If you would at any time like to review or change the information in your account or terminate your account, you can:">
          <LegalBullitLi>
            Log in to your account settings and update your user account.
          </LegalBullitLi>
        </LegalBullitList>
        <RegularLegalParagraph>
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, we may retain some information in our files to prevent fraud,
          troubleshoot problems, assist with any investigations, enforce our
          legal terms and/or comply with applicable legal requirements.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Cookies and similar technologies: Most Web browsers are set to accept
          cookies by default. If you prefer, you can usually choose to set your
          browser to remove cookies and to reject cookies. If you choose to
          remove cookies or reject cookies, this could affect certain features
          or services of our Services. For further information, please see our
          Cookie Notice: https://fluentflow.space/cookiespolicy.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          If you have questions or comments about your privacy rights, you may
          email us at info@istai.space.
        </RegularLegalParagraph>
      </section>
      <section id="updates">
        <RegularLegalHeader>
          10. DO WE MAKE UPDATES TO THIS NOTICE?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          In Short: Yes, we will update this notice as necessary to stay
          compliant with relevant laws.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          We may update this Privacy Notice from time to time. The updated
          version will be indicated by an updated "Revised" date at the top of
          this Privacy Notice. If we make material changes to this Privacy
          Notice, we may notify you either by prominently posting a notice of
          such changes or by directly sending you a notification. We encourage
          you to review this Privacy Notice frequently to be informed of how we
          are protecting your information.
        </RegularLegalParagraph>
      </section>
      <section id="contact">
        <RegularLegalHeader>
          11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          If you have questions or comments about this notice, you may email us
          at info@fluentflow.space or contact us by post at:
        </RegularLegalParagraph>
        <RegularLegalParagraph>FluentFlow</RegularLegalParagraph>
        <RegularLegalParagraph>info@fluentflow.space</RegularLegalParagraph>
        <RegularLegalParagraph>Kazakhstan</RegularLegalParagraph>
      </section>
    </div>
  );
}

import {
  LegalBullitLi,
  LegalBullitList,
  MainLegalHeader,
  RegularLegalHeader,
  RegularLegalParagraph,
  RegularLegalSmallHeader,
} from "@/components/legal/Legal";

export default function CookiePolicy() {
  return (
    <div className="max-w-[800px] flex flex-col gap-10 px-6">
      <MainLegalHeader updateDate="Sep 30, 2025" tag="Legal Document">
        Cookie Policy
      </MainLegalHeader>
      <section>
        <RegularLegalParagraph>
          This Cookie Policy explains how FluentFlow (&quot;Company,&quot;
          &quot;we,&quot; &quot;us,&quot; and &quot;our&quot;) uses cookies and
          similar technologies to recognize you when you visit our website at
          https://fluentflow.com (&quot;Website&quot;). It explains what these
          technologies are and why we use them, as well as your rights to
          control our use of them.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          In some cases we may use cookies to collect personal information, or
          that becomes personal information if we combine it with other
          information.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>What are cookies?</RegularLegalHeader>
        <RegularLegalParagraph>
          Cookies are small data files that are placed on your computer or
          mobile device when you visit a website. Cookies are widely used by
          website owners in order to make their websites work, or to work more
          efficiently, as well as to provide reporting information.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Cookies set by the website owner (in this case, FluentFlow) are called
          &quot;first-party cookies.&quot; Cookies set by parties other than the
          website owner are called &quot;third-party cookies.&quot; Third-party
          cookies enable third-party features or functionality to be provided on
          or through the website (e.g., advertising, interactive content, and
          analytics). The parties that set these third-party cookies can
          recognize your computer both when it visits the website in question
          and also when it visits certain other websites.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>Why do we use cookies?</RegularLegalHeader>
        <RegularLegalParagraph>
          We use first- and third-party cookies for several reasons. Some
          cookies are required for technical reasons in order for our Website to
          operate, and we refer to these as &quot;essential&quot; or
          &quot;strictly necessary&quot; cookies. Other cookies also enable us
          to track and target the interests of our users to enhance the
          experience on our Online Properties. Third parties serve cookies
          through our Website for advertising, analytics, and other purposes.
          This is described in more detail below.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>How can I control cookies?</RegularLegalHeader>
        <RegularLegalParagraph>
          You have the right to decide whether to accept or reject cookies. You
          can exercise your cookie rights by setting your preferences in the
          Cookie Consent Manager. The Cookie Consent Manager allows you to
          select which categories of cookies you accept or reject. Essential
          cookies cannot be rejected as they are strictly necessary to provide
          you with services.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          The Cookie Consent Manager can be found in the notification banner and
          on our Website. If you choose to reject cookies, you may still use our
          Website though your access to some functionality and areas of our
          Website may be restricted. You may also set or amend your web browser
          controls to accept or refuse cookies.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          The specific types of first- and third-party cookies served through
          our Website and the purposes they perform are described in the table
          below (please note that the specific cookies served may vary depending
          on the specific Online Properties you visit):
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>
          How can I control cookies on my browser?
        </RegularLegalHeader>
        <LegalBullitList
          description={`As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser&apos;s help menu for more information. The following is information about how to manage cookies on the most popular browsers:`}
        >
          <LegalBullitLi>
            <a
              href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
              className="text-blue-700"
            >
              Chrome
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a
              href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
              className="text-blue-700"
            >
              Internet Explorer
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
              className="text-blue-700"
            >
              Firefox
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a
              href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac"
              className="text-blue-700"
            >
              Safari
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
              className="text-blue-700"
            >
              Edge
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a
              href="https://help.opera.com/en/latest/web-preferences/"
              className="text-blue-700"
            >
              Opera
            </a>
          </LegalBullitLi>
        </LegalBullitList>
        <LegalBullitList
          description={`In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:`}
        >
          <LegalBullitLi>
            <a href="https://optout.aboutads.info/" className="text-blue-700">
              Digital Advertising Alliance
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a href="https://youradchoices.ca/" className="text-blue-700">
              Digital Advertising Alliance of Canada
            </a>
          </LegalBullitLi>
          <LegalBullitLi>
            <a
              href="https://www.youronlinechoices.com/"
              className="text-blue-700"
            >
              European Interactive Digital Advertising Alliance
            </a>
          </LegalBullitLi>
        </LegalBullitList>
      </section>
      <section>
        <RegularLegalHeader>
          What about other tracking technologies, like web beacons?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          Cookies are not the only way to recognize or track visitors to a
          website. We may use other, similar technologies from time to time,
          like web beacons (sometimes called &quot;tracking pixels&quot; or
          &quot;clear gifs&quot;). These are tiny graphics files that contain a
          unique identifier that enables us to recognize when someone has
          visited our Website or opened an email including them. This allows us,
          for example, to monitor the traffic patterns of users from one page
          within a website to another, to deliver or communicate with cookies,
          to understand whether you have come to the website from an online
          advertisement displayed on a third-party website, to improve site
          performance, and to measure the success of email marketing campaigns.
          In many instances, these technologies are reliant on cookies to
          function properly, and so declining cookies will impair their
          functioning.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>
          Do you use Flash cookies or Local Shared Objects?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          Websites may also use so-called &quot;Flash Cookies&quot; (also known
          as Local Shared Objects or &quot;LSOs&quot;) to, among other things,
          collect and store information about your use of our services, fraud
          prevention, and for other site operations.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          If you do not want Flash Cookies stored on your computer, you can
          adjust the settings of your Flash player to block Flash Cookies
          storage using the tools contained in the Website Storage Settings
          Panel. You can also control Flash Cookies by going to the Global
          Storage Settings Panel and following the instructions (which may
          include instructions that explain, for example, how to delete existing
          Flash Cookies (referred to &quot;information&quot; on the Macromedia
          site), how to prevent Flash LSOs from being placed on your computer
          without your being asked, and (for Flash Player 8 and later) how to
          block Flash Cookies that are not being delivered by the operator of
          the page you are on at the time).
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          Please note that setting the Flash Player to restrict or limit
          acceptance of Flash Cookies may reduce or impede the functionality of
          some Flash applications, including, potentially, Flash applications
          used in connection with our services or online content.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>
          Do you serve targeted advertising?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          Third parties may serve cookies on your computer or mobile device to
          serve advertising through our Website. These companies may use
          information about your visits to this and other websites in order to
          provide relevant advertisements about goods and services that you may
          be interested in. They may also employ technology that is used to
          measure the effectiveness of advertisements. They can accomplish this
          by using cookies or web beacons to collect information about your
          visits to this and other sites in order to provide relevant
          advertisements about goods and services of potential interest to you.
          The information collected through this process does not enable us or
          them to identify your name, contact details, or other details that
          directly identify you unless you choose to provide these.
        </RegularLegalParagraph>
      </section>
      <section>
        <RegularLegalHeader>
          How often will you update this Cookie Policy?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          We may update this Cookie Policy from time to time in order to
          reflect, for example, changes to the cookies we use or for other
          operational, legal, or regulatory reasons. Please therefore revisit
          this Cookie Policy regularly to stay informed about our use of cookies
          and related technologies.
        </RegularLegalParagraph>
        <RegularLegalParagraph>
          The date at the top of this Cookie Policy indicates when it was last
          updated.
        </RegularLegalParagraph>
      </section>
      <section className="mb-20">
        <RegularLegalHeader>
          Where can I get further information?
        </RegularLegalHeader>
        <RegularLegalParagraph>
          If you have any questions about our use of cookies or other
          technologies, please contact us at:
        </RegularLegalParagraph>
        <RegularLegalParagraph className="leading-4">
          FluentFlow
        </RegularLegalParagraph>
        <RegularLegalParagraph className="leading-4">
          Kazakhstan
        </RegularLegalParagraph>
        <RegularLegalParagraph className="leading-4">
          info@fluentflow.space
        </RegularLegalParagraph>
      </section>
    </div>
  );
}

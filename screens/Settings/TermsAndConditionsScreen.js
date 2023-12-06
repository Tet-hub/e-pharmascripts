import { View, Text, Image } from "react-native";
import React from "react";
import styles from "./terms";
import { ScrollView } from "react-native-gesture-handler";

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Terms & Conditions</Text>
      <View style={styles.line} />
      <View style={styles.insideContainer}>
        <Text style={styles.titleText}>
          Terms & Conditions of E-PharmaScripts
        </Text>
        <Text style={styles.contentText}>Welcome to E-PharmaScripts! </Text>
        <Text style={styles.contentText}>
          Before using our app, we kindly ask you to read and understand the
          following Terms and Conditions ("Terms") that govern your use of our
          services. By accessing or using our mobile app, you agree to be bound
          by these Terms. If you do not agree with any part of these Terms,
          please refrain from using our app.
        </Text>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Acceptance of Terms</Text>
          <Text style={styles.contentDesc}>
            By using our Online Pharmacy Ordering System Mobile App, you
            acknowledge that you have read, understood, and agreed to abide by
            these Terms. These Terms constitute a legally binding agreement
            between you and E-PharmaScripts.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Eligibility</Text>
          <Text style={styles.contentDesc}>
            You must be at least 18 years old to use our app. By using our app,
            you represent and warrant that you have the legal capacity and
            authority to agree to these Terms and to comply with all applicable
            laws and regulations.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Applicability and Services</Text>
          <Text style={styles.contentDesc}>
            Our mobile app provides an online platform for users to order
            pharmaceutical products from licensed pharmacies. The Company does
            not sell or dispense medications directly but facilitates the
            ordering process between users and partner pharmacies. The
            availability of specific products and services is subject to the
            policies and regulations of our partner pharmacies.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>User Responsibilities</Text>
          <Text style={styles.contentDesc}>
            <Text style={styles.boldText}>a. Registration:</Text> In order to
            use our app, you may be required to create an account and provide
            accurate, complete, and up-to-date information. You are responsible
            for maintaining the confidentiality of your account credentials and
            for any activities or actions taken using your account.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentDesc}>
            <Text style={styles.boldText}>
              b. Prescription and Medication Verification:
            </Text>{" "}
            It is your responsibility to ensure that you have a valid
            prescription for any medication you order through our app. You agree
            to provide accurate and complete information regarding your medical
            history, allergies, and other relevant information necessary for the
            safe and appropriate use of the medications.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentDesc}>
            <Text style={styles.boldText}>c. Compliance with Laws:</Text> You
            agree to comply with all applicable local, state, national, and
            international laws and regulations related to the use of our app,
            including but not limited to those related to prescription
            medications and controlled substances.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Use of Information</Text>
          <Text style={styles.contentDesc}>
            <Text style={styles.boldText}>a. Privacy:</Text> We respect your
            privacy and are committed to protecting your personal information.
            b. Communications: By using our app, you consent to receive
            communications from the Company, including but not limited to
            notifications, alerts, newsletters, and promotional materials. You
            can opt-out of receiving marketing communications at any time.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Intellectual Property</Text>
          <Text style={styles.contentDesc}>
            All content and materials available on our app, including but not
            limited to text, graphics, logos, button icons, images, audio clips,
            digital downloads, data compilations, and software, are the property
            of the Company or its licensors and are protected by intellectual
            property laws. You agree not to use, reproduce, distribute, modify,
            or create derivative works from any content or materials without
            prior written consent from the Company.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Limitation of Liability</Text>
          <Text style={styles.contentDesc}>
            To the fullest extent permitted by applicable law, the Company and
            its officers, directors, employees, agents, affiliates, and partners
            shall not be liable for any direct, indirect, incidental, special,
            consequential, or exemplary damages, including but not limited to
            damages for loss of profits, goodwill, use, data, or other
            intangible losses arising out of or in connection with your use of
            our app.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Modification and Termination</Text>
          <Text style={styles.contentDesc}>
            <Text style={styles.boldText}>a. Modification:</Text> The Company
            reserves the right to modify or update these Terms at any time
            without prior notice. Any changes will be effective upon posting the
            updated Terms on our app. It is your responsibility to review the
            Terms periodically. Continued use of our app after any modifications
            signifies your acceptance of the updated Terms.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentDesc}>
            <Text style={styles.boldText}>b. Termination:</Text> The Company
            may, at its sole discretion, suspend or terminate your access to our
            app for any reason, including but not limited to violation of these
            Terms or suspected fraudulent, abusive, or illegal activities.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>
            Governing Law and Dispute Resolution
          </Text>
          <Text style={styles.contentDesc}>
            These Terms shall be governed by and construed in accordance with
            the laws of the Philippines. Any dispute, controversy, or claim
            arising out of or relating to these Terms or the breach,
            termination, or validity thereof shall be settled through
            negotiation in good faith. If the dispute cannot be resolved through
            negotiation, it shall be submitted to binding arbitration in
            accordance with the rules of [Arbitration Institution/Body].
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentTitle}>Severability</Text>
          <Text style={styles.contentDesc}>
            If any provision of these Terms is found to be invalid, illegal, or
            unenforceable, the remaining provisions shall continue in full force
            and effect to the maximum extent permitted by law.
          </Text>
        </View>
        <View style={styles.contentDiv}>
          <Text style={styles.contentDesc}>
            These Terms and Conditions constitute the entire agreement between
            you and the Company regarding the use of our Online Pharmacy
            Ordering System Mobile App. If you have any concerns about these
            Terms, please contact us at epharmascripts@gmail.com.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TermsAndConditionsScreen;

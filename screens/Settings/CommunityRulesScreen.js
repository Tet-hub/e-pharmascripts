import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import styles from "./cr";
import { ScrollView } from "react-native-gesture-handler";

const CommunityRulesScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Community Rules</Text>
      <View style={styles.line} />

      <View style={styles.insideContainer}>
        <Text style={styles.topTitle}>COMMUNITY RULES</Text>
        <Text style={styles.titleDesc}>
          Welcome to our E-Pharmascripts! To ensure a positive and secure
          environment for all users, we've established a set of community rules
          to guide your interactions within the app. We encourage respectful
          communication between customers and pharmacy branches, emphasizing
          clear and accurate inquiries. Timely responses, adherence to app
          guidelines, and the use of our Help Center for reporting and
          assistance are crucial for a seamless experience. Prioritize privacy,
          maintain confidentiality, and engage in constructive feedback to
          contribute to the community's growth. Avoid offensive language, misuse
          of messaging features, and any form of harassment or intimidation.
          Your cooperation in reporting violations and promoting safety is
          invaluable. Let's work together to create a supportive and efficient
          platform for all your pharmaceutical needs!
        </Text>
        <Text style={styles.dosText}>The Do's</Text>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>1. Respectful Communication</Text>
          <Text style={styles.dosContent}>
            - Communicate with pharmacy branches and other users respectfully.
          </Text>
          <Text style={styles.dosContent2}>
            - Use polite and professional language in all interactions.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>2. Accurate Inquiry</Text>
          <Text style={styles.dosContent}>
            - Clearly state your concerns or questions when messaging a specific
            pharmacy branch.
          </Text>
          <Text style={styles.dosContent2}>
            - Provide accurate information about your order for efficient
            assistance.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>3. Timely Responses</Text>
          <Text style={styles.dosContent}>
            - Respond promptly to messages from the pharmacy branches or fellow
            customers.
          </Text>
          <Text style={styles.dosContent2}>
            - Keep communication channels open and acknowledge receipt of
            important information.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>
            4. Use Help Center Responsibly
          </Text>
          <Text style={styles.dosContent}>
            - Utilize the Help Center for reporting violations, unusual
            circumstances, or seeking assistance.
          </Text>
          <Text style={styles.dosContent2}>
            - Provide detailed information when issuing a report to expedite
            resolution.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>
            5. Privacy and Confidentiality
          </Text>
          <Text style={styles.dosContent}>
            - Respect the privacy of pharmacy branches and fellow customers.
          </Text>
          <Text style={styles.dosContent2}>
            - Avoid sharing sensitive information in public forums; use private
            messaging for confidential matters.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>6. Follow App Guidelines</Text>
          <Text style={styles.dosContent}>
            - Adhere to the terms of service and guidelines provided by the app.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any violations or suspicious activities promptly.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>
            7. Safety and Legal Compliance
          </Text>
          <Text style={styles.dosContent}>
            - Encourage the safe and legal use of the online ordering system.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any instances of fraudulent activities or illegal conduct.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>8. Constructive Feedback</Text>
          <Text style={styles.dosContent}>
            - Share constructive feedback to help improve the overall user
            experience.
          </Text>
          <Text style={styles.dosContent2}>
            - Provide suggestions for enhancements to the app or ordering
            process.
          </Text>
        </View>
        <Text style={styles.dontsText}>The Dont's</Text>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>1. No Offensive Language</Text>
          <Text style={styles.dosContent}>
            - Avoid using offensive, discriminatory, or inappropriate language
            in any communication.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any instances of offensive language or behavior.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>2. No Misuse of Messaging</Text>
          <Text style={styles.dosContent}>
            - Do not misuse the messaging feature for spam or unrelated
            promotions.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any instances of unsolicited promotional messages.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>3. No False Reporting</Text>
          <Text style={styles.dosContent}>
            - Do not issue false reports through the Help Center to mislead or
            harm others.
          </Text>
          <Text style={styles.dosContent2}>
            - Report only genuine concerns or violations.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>4. No Unauthorized Access</Text>
          <Text style={styles.dosContent}>
            - Do not attempt to access unauthorized information or manipulate
            the app's system.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any security vulnerabilities responsibly.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>
            5. No Harassment or Intimidation
          </Text>
          <Text style={styles.dosContent}>
            - Do not engage in harassment or intimidation towards pharmacy
            branches or fellow customers.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any instances of harassment promptly.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>6. No Violation of Privacy</Text>
          <Text style={styles.dosContent}>
            - Do not share personal information about pharmacy branches or
            fellow customers without consent.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any breaches of privacy immediately.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>7. No Fraudulent Activities</Text>
          <Text style={styles.dosContent}>
            - Do not engage in or promote fraudulent activities, including
            payment-related scams.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any suspicious transactions or behavior.
          </Text>
        </View>
        <View style={styles.dosContainer}>
          <Text style={styles.titleTextDos}>8. No Violation of Laws</Text>
          <Text style={styles.dosContent}>
            - Do not engage in activities that violate local or international
            laws.
          </Text>
          <Text style={styles.dosContent2}>
            - Report any illegal activities immediately.
          </Text>
        </View>

        <Text style={styles.bottomParagraph}>
          By following these community rules, users can contribute to a positive
          and secure environment within E-Pharmascripts, fostering a culture of
          mutual respect, efficient communication, and responsible use of the
          app's services.
        </Text>
      </View>
    </ScrollView>
  );
};

export default CommunityRulesScreen;

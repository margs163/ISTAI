import Image from "next/image";
import phoneMain from "@/assets/images/phoneEdited1.png";
import phoneMain2 from "@/assets/images/phoneEdited2.png";
import FaqItem from "./FaqItem";

type Faq = {
  title: string;
  description: string;
};

const faqs: Faq[] = [
  {
    title: "How accurate is the AI feedback?",
    description:
      "Our AI uses advanced algorithms to evaluate your speaking performance and provides feedback based on official IELTS criteria. Accuracy is regularly tested and improved to ensure reliable results.",
  },
  {
    title: "Does the simulator follow real IELTS test conditions?",
    description:
      "Yes, our simulator replicates the timing, question types, and structure of the official IELTS Speaking Test for a realistic practice experience.",
  },
  {
    title: "Can I track my progress over time?",
    description:
      "You can review your past performances, see detailed feedback, and monitor your improvement with our built-in progress tracking features.",
  },
  {
    title: "Is instant feedback available after each test?",
    description:
      "Yes, you receive comprehensive feedback immediately after completing each speaking test, helping you focus on areas for improvement.",
  },
];

export default function AppFaq() {
  return (
    <section className="w-full flex flex-col items-center p-8 gap-8 lg:flex-row lg:p-20 lg:px-20 xl:px-42 lg:gap-12 xl:gap-20 relative">
      <div className="hidden lg:flex flex-col gap-8 lg:flex-1/2">
        <h2 className="font-semibold text-3xl lg:text-5xl lg:font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="hidden lg:flex lg:flex-col gap-8 max-w-[600px]">
          {faqs.map((item, index) => {
            return <FaqItem key={index} item={item} />;
          })}
        </div>
      </div>
      <div className="grad-bg p-6 lg:p-2 rounded-3xl lg:rounded-4xl h-[300px] lg:h-[500px] lg:max-w-[580px] overflow-hidden flex flex-row justify-center gap-0 lg:flex-1/2 xl:flex-1/2 lg:pt-12">
        <Image
          src={phoneMain2}
          alt="phoneDamn"
          className="min-h-[360px] w-auto lg:min-h-[500px] rounded-3xl xl:rounded-4xl relative left-14 lg:left-20 -bottom-16"
        />
        <Image
          src={phoneMain}
          alt="phoneDamn"
          className="min-h-[360px] w-auto lg:min-h-[540px] rounded-3xl xl:rounded-4xl relative right-14 lg:right-20"
        />
      </div>
      <div className="flex flex-col lg:hidden gap-10">
        <h2 className="font-semibold text-3xl lg:text-5xl lg:font-semibold max-w-[300px]">
          Frequently Asked Questions
        </h2>
        <div className="lg:hidden flex flex-col gap-8">
          {faqs.map((item, index) => {
            return <FaqItem key={index} item={item} />;
          })}
        </div>
      </div>
    </section>
  );
}

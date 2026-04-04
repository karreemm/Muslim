import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSadaqaGarya } from "../../context/features/SadaqatContext";
import { slugify } from "../../utils/helpers";
import { DeceasedPerson } from "../../app/(pages)/sadaqa-garya/types";

export default function useSadaqaGaryaForm() {
  const router = useRouter();
  const { addDeceasedPerson } = useSadaqaGarya();

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [messageEn, setMessageEn] = useState(
    "This is a Sadaqa Jariyah page for the deceased. May Allah elevate their status in Jannah and grant them peace. Ameen.",
  );
  const [messageAr, setMessageAr] = useState(
    "هذه صفحة صدقة جارية للمتوفى. نسأل الله أن يرفع درجته في الجنة ويجعل قبره روضة من رياض الجنة. آمين.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    return nameEn.trim() !== "" && nameAr.trim() !== "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn || !nameAr || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const timestamp = new Date().getTime();
      const baseSlug = slugify(nameEn);
      const uniqueSlug = `${baseSlug}-${timestamp}`;

      const response = await fetch("/api/sadaqa-garya", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameEn,
          nameAr,
          messageEn,
          messageAr,
          slug: uniqueSlug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Sadaqa page");
      }

      const result = (await response.json()) as {
        deceased: DeceasedPerson;
        deleteToken?: string;
      };

      if (typeof window !== "undefined" && result?.deleteToken) {
        try {
          const raw = localStorage.getItem("sadaqaDeleteTokens");
          const parsed = raw ? JSON.parse(raw) : {};
          const tokens =
            parsed && typeof parsed === "object"
              ? (parsed as Record<string, string>)
              : {};
          tokens[result.deceased.slug] = result.deleteToken;
          localStorage.setItem("sadaqaDeleteTokens", JSON.stringify(tokens));
        } catch {
        }
      }

      addDeceasedPerson(result.deceased);

      await router.push(`/sadaqa-garya/${result.deceased.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNameEn("");
    setNameAr("");
    setMessageEn(
      "This is a Sadaqa Jariyah page for the deceased. May Allah elevate their status in Jannah and grant them peace. Ameen.",
    );
    setMessageAr(
      "هذه صفحة صدقة جارية للمتوفى. نسأل الله أن يرفع درجته في الجنة ويجعل قبره روضة من رياض الجنة. آمين.",
    );
    setIsSubmitting(false);
  };

  return {
    nameEn,
    nameAr,
    messageEn,
    messageAr,
    isSubmitting,

    setNameEn,
    setNameAr,
    setMessageEn,
    setMessageAr,
    handleSubmit,
    validateForm,
    resetForm,
  };
}

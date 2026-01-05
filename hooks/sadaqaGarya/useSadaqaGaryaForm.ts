import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSadaqaGarya } from "../../context/SadaqatContext";
import { slugify } from "../../utils/helpers";
import { DeceasedPerson } from "../../types";
import { safeEncode } from "../../utils/encoding";

export default function useSadaqaGaryaForm() {
  const router = useRouter();
  const { addDeceasedPerson } = useSadaqaGarya();

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [messageEn, setMessageEn] = useState(
    "This is a Sadaqa Jariyah page for the deceased. May Allah elevate their status in Jannah and grant them peace. Ameen."
  );
  const [messageAr, setMessageAr] = useState(
    "هذه صفحة صدقة جارية للمتوفى. نسأل الله أن يرفع درجته في الجنة ويجعل قبره روضة من رياض الجنة. آمين."
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

      const deceased: DeceasedPerson = {
        id: uniqueSlug,
        nameEn,
        nameAr,
        messageEn,
        messageAr,
        slug: uniqueSlug,
        createdAt: new Date().toISOString(),
      };

      await addDeceasedPerson(deceased);

      const encodedData = safeEncode(deceased);

      await router.push(`/sadaqa-garya/${uniqueSlug}?data=${encodedData}`);
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
      "This is a Sadaqa Jariyah page for the deceased. May Allah elevate their status in Jannah and grant them peace. Ameen."
    );
    setMessageAr(
      "هذه صفحة صدقة جارية للمتوفى. نسأل الله أن يرفع درجته في الجنة ويجعل قبره روضة من رياض الجنة. آمين."
    );
    setIsSubmitting(false);
  };

  return {
    // Form state
    nameEn,
    nameAr,
    messageEn,
    messageAr,
    isSubmitting,

    // Form actions
    setNameEn,
    setNameAr,
    setMessageEn,
    setMessageAr,
    handleSubmit,
    validateForm,
    resetForm,
  };
}

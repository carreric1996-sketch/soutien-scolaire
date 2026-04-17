export const SUBJECT_COLORS: Record<string, string> = {
  "Mathématiques": "bg-blue-50 text-blue-700 border-blue-100",
  "Physique-Chimie": "bg-purple-50 text-purple-700 border-purple-100",
  "SVT": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Anglais": "bg-amber-50 text-amber-700 border-amber-100",
  "Français": "bg-rose-50 text-rose-700 border-rose-100",
  "Philosophie": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Informatique": "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Autre": "bg-gray-50 text-gray-600 border-gray-100",
};

export function getWhatsAppUrl(
  phone: string,
  status: string,
  studentName: string,
  teacherName: string,
  centerName?: string
) {
  const cleanPhone = phone.replace(/\D/g, "");
  const sender = centerName ? `${teacherName} (${centerName})` : teacherName;
  const message =
    status === "Paid"
      ? `Bonjour, le paiement pour ${studentName} a bien été reçu. Merci beaucoup !`
      : `Bonjour, c'est ${sender}. Je vous contacte pour le suivi du cours de ${studentName}. Pourriez-vous nous envoyer le règlement pour ce mois ? Merci !`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

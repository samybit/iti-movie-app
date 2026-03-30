import SignupForm from "@/components/signup-form";
import usePageTitle from "@/hooks/usePageTitle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Register() {
	const { t } = useLanguage();
	usePageTitle(t('register'));
	return (
		<>
			<SignupForm />
		</>
	);
}
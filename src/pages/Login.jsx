import SigninForm from "@/components/login-form";
import usePageTitle from "@/hooks/usePageTitle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
	const { t } = useLanguage();
	usePageTitle(t('login'));
	return (
		<>
			<SigninForm />
		</>
	);
}
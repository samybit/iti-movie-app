import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

function VerifyEmail() {
  const { t } = useLanguage();
  return (
    <div className="flex border-2 border-dashed border-gray-200 flex-col p-12  items-center justify-center bg-purple-50 mt-32">

      <div className="text-center space-y-6">

        <h1 className="text-3xl font-bold">
          {t('verifyEmailTitle')}
        </h1>

        <p className="max-w-md">
          {t('verifyEmailDesc1')} <span className="text-red-500 font-bold ">{t('verifyEmailDesc2')}</span> {t('verifyEmailDesc3')}
            </p>

        <Button asChild>
          <Link to="/login">
            {t('goToLogin')}
          </Link>
        </Button>

      </div>

    </div>
  );
}

export default VerifyEmail;
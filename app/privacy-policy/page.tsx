import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité • FutureVoyance",
  description:
    "Découvrez comment FutureVoyance.io collecte, utilise et protège vos données personnelles. Politique de confidentialité transparente et complète.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "17 février 2026";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Politique de confidentialité
        </h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Dernière mise à jour :</strong> {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Bienvenue sur FutureVoyance.io. Nous nous engageons à protéger votre vie privée 
            et à traiter vos données personnelles avec le plus grand soin. Cette politique 
            de confidentialité explique comment nous collectons, utilisons, stockons et 
            protégeons vos informations personnelles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Données collectées</h2>
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              Nous collectons les types de données suivants :
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Informations de compte :</strong> adresse e-mail, nom, photo de profil (si fournie par Facebook)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Données techniques :</strong> logs de connexion, adresse IP, informations sur l'appareil</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Interactions Oracle :</strong> questions posées, historique des consultations (si applicable)</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Finalités du traitement</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous utilisons vos données dans les buts suivants :
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Authentification :</strong> gérer votre compte et vos connexions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Sécurité :</strong> protéger notre plateforme contre les abus</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Support :</strong> répondre à vos demandes d'assistance</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Amélioration du service :</strong> optimiser l'expérience utilisateur</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Base légale</h2>
          <p className="text-gray-700 leading-relaxed">
            Le traitement de vos données repose sur votre consentement explicite lors de 
            l'inscription et sur notre intérêt légitime à assurer la sécurité et le bon 
            fonctionnement de nos services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Partage des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous pouvons partager vos données avec :
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Prestataires de services :</strong> hébergeurs, services d'analytics, services cloud</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Important :</strong> nous ne vendons jamais vos données personnelles</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Durées de conservation</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Données de compte :</strong> tant que votre compte est actif</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Logs techniques :</strong> 30 à 90 jours maximum</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Demandes de support :</strong> selon les obligations légales</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Sécurité</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
            pour protéger vos données contre tout accès non autorisé, modification, 
            divulgation ou destruction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Vos droits</h2>
          <p className="text-gray-700 leading-relaxed">
            Vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Droit d'accès :</strong> consulter vos données</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Droit de rectification :</strong> corriger vos données</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Droit de suppression :</strong> demander l'effacement de vos données</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou pour exercer 
            vos droits, contactez-nous à l'adresse suivante :
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800 font-medium">EMAIL_SUPPORT</p>
          </div>
        </section>

        {/* Cross-link */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-gray-600">
            Consultez également notre{" "}
            <Link 
              href="/data-deletion" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              guide de suppression des données
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
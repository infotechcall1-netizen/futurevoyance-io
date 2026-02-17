import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Suppression des données • FutureVoyance",
  description:
    "Comment supprimer définitivement vos données personnelles de FutureVoyance.io. Procédure simple et transparente.",
};

export default function DataDeletionPage() {
  const lastUpdated = "17 février 2026";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Suppression des données
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
          <h2 className="text-2xl font-semibold text-gray-900">Comment supprimer vos données</h2>
          <p className="text-gray-700 leading-relaxed">
            Vous avez le droit de demander la suppression définitive de toutes vos données 
            personnelles de nos systèmes. Voici la procédure simple à suivre :
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Procédure en 3 étapes</h2>
          
          <div className="grid gap-6">
            {/* Étape 1 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Envoyer un email de demande
                  </h3>
                  <p className="text-gray-700">
                    Envoyez votre demande de suppression à l'adresse suivante :
                  </p>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2">
                    <p className="text-gray-800 font-medium">EMAIL_SUPPORT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Utiliser le bon sujet
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Dans l'objet de votre email, indiquez :
                  </p>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-800 font-medium">"Suppression de données Facebook"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Fournir vos informations
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Incluez dans votre message :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span>Votre adresse email Facebook</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span>Votre nom complet</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span>Votre user ID si vous le connaissez (optionnel)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Délai de traitement</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">
              <strong>⏱️ Délai :</strong> Votre demande sera traitée sous 7 jours ouvrés maximum.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Ce qui sera supprimé</h2>
          <p className="text-gray-700 leading-relaxed">
            Lors de la suppression de vos données, nous effacerons :
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Votre profil utilisateur complet</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Tout l'historique de vos consultations Oracle</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Vos données personnelles (nom, email, photo)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>Toutes les interactions liées à votre compte</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Ce qui peut être conservé</h2>
          <p className="text-gray-700 leading-relaxed">
            Certaines données peuvent être conservées temporairement pour :
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Respecter nos obligations légales</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Logs de sécurité (durée limitée)</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Données agrégées et anonymisées</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Contact et support</h2>
          <p className="text-gray-700 leading-relaxed">
            Si vous avez des questions concernant la procédure de suppression ou si vous 
            rencontrez des difficultés, n'hésitez pas à nous contacter :
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800 font-medium">EMAIL_SUPPORT</p>
            <p className="text-gray-600 text-sm mt-1">
              Notre équipe support vous répondra dans les plus brefs délais.
            </p>
          </div>
        </section>

        {/* Cross-link */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-gray-600">
            Consultez également notre{" "}
            <Link 
              href="/privacy-policy" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              politique de confidentialité complète
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
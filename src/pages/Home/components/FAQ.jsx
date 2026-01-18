import { 
    ChevronDown, 
    HelpCircle,
    MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { faqQuestions } from '../../../data/data';
import { FaWhatsapp } from 'react-icons/fa';

const FAQ = () => {
    const [openItems, setOpenItems] = useState([]);

    const toggleItem = (index) => {
        if (openItems.includes(index)) {
            setOpenItems(openItems.filter(item => item !== index));
        } else {
            setOpenItems([...openItems, index]);
        }
    };

    return (
        <section id="faq" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Questions <span className="text-pink-500">fréquentes</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Tout ce que vous devez savoir sur EasyNotes
                    </p>
                </div>

                {/* Liste unique des questions */}
                <div className="max-w-3xl mx-auto space-y-3 mb-12">
                    {faqQuestions.map((item, index) => {
                        const isOpen = openItems.includes(index);
                        
                        return (
                            <div 
                                key={index} 
                                className="border border-gray-200 rounded-lg transition-all hover:shadow-sm"
                            >
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 text-left"
                                >
                                    <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                                    <ChevronDown 
                                        className={`w-5 h-5 text-pink-500 transition-transform flex-shrink-0 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                
                                {isOpen && (
                                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                                        <p className="text-gray-700 leading-relaxed">{item.a}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Section contact */}
                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-8 max-w-2xl mx-auto border border-pink-100">
                        <MessageCircle className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Une question spécifique ?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Je suis disponible pour répondre à toutes vos interrogations
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Créateur : Kouaho Ekissi David Emmanuel<br />
                            Étudiant en Licence 3 Génie Informatique - IUA
                        </p>
                        <a 
                            href="https://wa.me/+225071136261"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Me contacter sur WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
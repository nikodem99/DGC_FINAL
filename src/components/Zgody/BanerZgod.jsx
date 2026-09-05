import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    KATEGORIE, WYBIERALNE, czyRozstrzygniete, stanZgod, zapiszZgody,
    wszystkie, nasluchujZgod,
} from '../../lib/zgody';

// Standardowy baner cookies.
// - statystyki i marketing sa domyslnie odznaczone; zgoda musi byc aktywna,
// - "Odrzuć wszystkie" i "Akceptuję wszystkie" maja ten sam rozmiar i stoja
//   na tej samej warstwie. Przycisk odmowy mniejszy albo schowany pod
//   "Ustawieniami" to ciemny wzorzec, ktory unieważnia zgode,
// - samo przewijanie strony niczego nie zatwierdza,
// - decyzje da sie zmienic odnosnikiem w stopce.
const BanerZgod = () => {
    const [widoczny, setWidoczny] = useState(false);
    const [szczegoly, setSzczegoly] = useState(false);
    const [wybor, setWybor] = useState(() => wszystkie(false));

    useEffect(() => {
        setWidoczny(!czyRozstrzygniete());
        return nasluchujZgod(() => {
            const stan = stanZgod();
            setWidoczny(stan === null);
            if (stan === null) {
                setSzczegoly(false);
                setWybor(wszystkie(false));
            }
        });
    }, []);

    if (!widoczny) return null;

    const zatwierdz = (zgody) => {
        zapiszZgody(zgody);
        setWidoczny(false);
    };

    return (
        <div className="zgody_baner" role="dialog" aria-live="polite" aria-label="Zgoda na pliki cookies">
            <div className="zgody_baner_tresc">
                <h2>Pliki cookies</h2>
                <p>
                    Używamy plików cookies niezbędnych do działania strony. Za Twoją zgodą
                    chcemy też korzystać z plików służących do statystyk i marketingu, żeby
                    lepiej dopasować treści i mierzyć skuteczność działań. Zgodę możesz
                    w każdej chwili zmienić. Więcej w{' '}
                    <Link to="/polityka-prywatnosci">polityce prywatności</Link>.
                </p>

                {szczegoly && (
                    <ul className="zgody_lista">
                        {KATEGORIE.map((k) => (
                            <li key={k.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={k.zawsze ? true : !!wybor[k.id]}
                                        disabled={k.zawsze}
                                        onChange={(e) =>
                                            setWybor({ ...wybor, [k.id]: e.target.checked })
                                        }
                                    />
                                    <span>
                                        <strong>
                                            {k.nazwa}
                                            {k.zawsze && <em> (zawsze aktywne)</em>}
                                        </strong>
                                        {k.opis}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="zgody_baner_akcje">
                <button type="button" className="zgody_btn" onClick={() => zatwierdz(wszystkie(false))}>
                    Odrzuć wszystkie
                </button>
                <button type="button" className="zgody_btn zgody_btn_glowny" onClick={() => zatwierdz(wszystkie(true))}>
                    Akceptuję wszystkie
                </button>
                {szczegoly ? (
                    <button type="button" className="zgody_link" onClick={() => zatwierdz(wybor)}>
                        Zapisz wybór
                    </button>
                ) : (
                    <button type="button" className="zgody_link" onClick={() => setSzczegoly(true)}>
                        Ustawienia
                    </button>
                )}
            </div>
        </div>
    );
};

export default BanerZgod;

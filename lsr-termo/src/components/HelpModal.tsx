import { useEffect } from "react";
import styles from "./HelpModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const HelpModal = ({ isOpen, onClose }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Fechar"
        >
          ✕
        </button>
        
        <div className={styles.content}>
          <h2 className={styles.title}>Como Jogar</h2>
          
          <p className={styles.description}>
            Descubra a palavra secreta em até 6 tentativas.
          </p>
          
          <div className={styles.examples}>
            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <div className={`${styles.exampleTile} ${styles.correctTile}`}>T</div>
                <div className={styles.exampleTile}>E</div>
                <div className={styles.exampleTile}>R</div>
                <div className={styles.exampleTile}>M</div>
                <div className={styles.exampleTile}>O</div>
              </div>
              <p className={styles.exampleText}>
                Letras <span className={styles.green}>verdes</span> estão na posição correta
              </p>
            </div>
            
            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <div className={styles.exampleTile}>P</div>
                <div className={`${styles.exampleTile} ${styles.wrongPlaceTile}`}>R</div>
                <div className={styles.exampleTile}>A</div>
                <div className={styles.exampleTile}>T</div>
                <div className={styles.exampleTile}>O</div>
              </div>
              <p className={styles.exampleText}>
                Letras <span className={styles.yellow}>amarelas</span> existem na palavra, mas na posição errada
              </p>
            </div>
            
            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <div className={styles.exampleTile}>C</div>
                <div className={styles.exampleTile}>A</div>
                <div className={`${styles.exampleTile} ${styles.wrongTile}`}>N</div>
                <div className={styles.exampleTile}>T</div>
                <div className={styles.exampleTile}>O</div>
              </div>
              <p className={styles.exampleText}>
                Letras <span className={styles.gray}>escuras</span> não fazem parte da palavra
              </p>
            </div>
          </div>
          
          <p className={styles.footer}>
            Use o teclado virtual ou o teclado do dispositivo para jogar.
          </p>
        </div>
      </div>
    </div>
  );
};
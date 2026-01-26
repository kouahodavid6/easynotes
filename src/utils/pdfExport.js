import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = async ({ title, subtitle, fileName, data, columns, summary, filters }) => {
    const doc = new jsPDF('landscape');
    
    // Titre
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    // Sous-titre si présent
    let currentY = 30;
    if (subtitle) {
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(subtitle, 14, currentY);
        currentY += 8;
    }
    
    // Date de génération
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 14, currentY);
    currentY += 8;
    
    // Filtres appliqués
    if (filters) {
        doc.setFontSize(10);
        let filterText = 'Filtres : ';
        if (filters.classe && filters.classe !== 'Toutes les classes') {
            filterText += `Classe : ${filters.classe}`;
        }
        if (filters.searchTerm) {
            if (filterText !== 'Filtres : ') filterText += ' | ';
            filterText += `Recherche : "${filters.searchTerm}"`;
        }
        if (filterText !== 'Filtres : ') {
            const maxWidth = 250;
            let lines = doc.splitTextToSize(filterText, maxWidth);
            lines.forEach((line, index) => {
                doc.text(line, 14, currentY + (index * 5));
            });
            currentY += (lines.length * 5) + 3;
        }
    }
    
    // Résumé
    if (summary) {
        doc.setFontSize(10);
        doc.text(`Total : ${summary.total} étudiants | ${summary.classes} classes`, 14, currentY);
        currentY += 8;
    }
    
    // Préparer les données
    const tableColumn = columns.map(col => col.header);
    const tableRows = data.map(item => 
        columns.map(col => item[col.key])
    );
    
    // Créer le tableau avec ajustement automatique
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: 'grid', // 'grid' au lieu de 'striped' pour voir toutes les bordures
        headStyles: {
            fillColor: [219, 39, 119], // Rose
            textColor: 255,
            fontSize: 9, // Plus petit pour tenir plus de colonnes
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: 2
        },
        bodyStyles: {
            fontSize: 8, // Plus petit pour tenir plus de colonnes
            cellPadding: 2,
            overflow: 'linebreak',
            minCellHeight: 6,
            valign: 'middle'
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        margin: { left: 10, right: 10 },
        styles: {
            overflow: 'linebreak',
            cellWidth: 'auto', // Largeur automatique
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
            textColor: [0, 0, 0]
        },
        columnStyles: {
            // Vous pouvez ajuster certaines colonnes spécifiques ici si nécessaire
            0: { cellWidth: 'auto' }, // Nom
            1: { cellWidth: 'auto' }, // Prénom
            2: { cellWidth: 'auto' }, // Matricule
            3: { cellWidth: 'auto' }, // Email
            4: { cellWidth: 'auto' }, // Téléphone
            5: { cellWidth: 'auto' }, // Niveau
            6: { cellWidth: 'auto' }, // Classe
            7: { cellWidth: 'auto' }  // Date
        },
        tableWidth: 'auto', // S'adapte automatiquement
        horizontalPageBreak: true, // Permet les sauts de page horizontaux si nécessaire
        didDrawPage: function (data) {
            // Numéro de page
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Page ${data.pageNumber} sur ${pageCount} | Établissement Scolaire`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
    });
    
    // Sauvegarder
    doc.save(fileName);
};
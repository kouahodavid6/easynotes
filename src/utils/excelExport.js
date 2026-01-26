import * as XLSX from 'xlsx';

export const exportToExcel = ({ fileName, data, sheetName, title, date, filters }) => {
    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    
    // Préparer les données avec en-tête
    const worksheetData = [
        [title],
        [`Date : ${date}`],
    ];
    
    // Ajouter les filtres appliqués
    if (filters) {
        let filterText = '';
        if (filters.classe && filters.classe !== 'Toutes') {
            filterText = `Filtre : Classe - ${filters.classe}`;
        }
        if (filters.searchTerm) {
            if (filterText) filterText += ' | ';
            filterText += `Recherche : "${filters.searchTerm}"`;
        }
        if (filterText) {
            worksheetData.push([filterText]);
        }
    }
    
    worksheetData.push([], Object.keys(data[0]), ...data.map(item => Object.values(item)));
    
    // Créer la feuille
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Fusionner les cellules du titre
    const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(data[0]).length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: Object.keys(data[0]).length - 1 } }
    ];
    
    // Ajouter fusion pour les filtres si présents
    if (filters && (filters.classe || filters.searchTerm)) {
        merges.push({ s: { r: 2, c: 0 }, e: { r: 2, c: Object.keys(data[0]).length - 1 } });
    }
    
    ws['!merges'] = merges;
    
    // Style des cellules
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // Style du titre
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
            font: { bold: true, sz: 16, color: { rgb: "FF1E40A0" } },
            alignment: { horizontal: "center" }
        };
    }
    
    // Style de la date
    const dateAddress = XLSX.utils.encode_cell({ r: 1, c: 0 });
    if (ws[dateAddress]) {
        ws[dateAddress].s = {
            font: { italic: true, sz: 11, color: { rgb: "FF666666" } },
            alignment: { horizontal: "center" }
        };
    }
    
    // Style des filtres
    if (filters && (filters.classe || filters.searchTerm)) {
        const filterAddress = XLSX.utils.encode_cell({ r: 2, c: 0 });
        if (ws[filterAddress]) {
            ws[filterAddress].s = {
                font: { sz: 10, color: { rgb: "FF2196F3" } },
                alignment: { horizontal: "center" }
            };
        }
    }
    
    // Déterminer la ligne de départ des en-têtes
    const headerRow = filters && (filters.classe || filters.searchTerm) ? 4 : 3;
    
    // Style des en-têtes
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: headerRow, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
            font: { bold: true, sz: 12 },
            fill: { fgColor: { rgb: "FFE75480" } },
            alignment: { horizontal: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };
    }
    
    // Largeur des colonnes
    ws['!cols'] = Object.keys(data[0]).map(() => ({ width: 20 }));
    
    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Sauvegarder
    XLSX.writeFile(wb, fileName);
};
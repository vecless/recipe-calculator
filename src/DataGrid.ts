import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FactorData } from "./components/Factor";
import { IDBEntry, db_at_home } from "./utils";

export const DATAGRIDCOLS: GridColDef[] = [
    { field: 'formula_name', headerName: 'Name', width: 125 },
    { field: 'volume', headerName: 'Volume (mL)' },
    { field: 'kcal', headerName: 'Energy (kcal)' },
    { field: 'protein', headerName: 'Protein (g)' },
    { field: 'calcium', headerName: 'Calcium (mg)' },
    { field: 'phosphorus', headerName: 'Phos (mg)' },
    { field: 'kalium', headerName: 'K+ (mg)' },
    { field: 'sodium', headerName: 'Na+ (mg)' },
    { field: 'magnesium', headerName: 'Magnesium (mg)' },
    { field: 'retinol_iu', headerName: 'Retinol (IU)' },
    { field: 'vit_d_iu', headerName: 'Vit D (IU)' },
    { field: 'carb', headerName: 'Carb (g)' },
    { field: 'fat', headerName: 'Fat (g)' },
];

export const generateGridRowsProp = (factorData: FactorData[]): GridRowsProp => {
    const factorDataFiltered: FactorData[] = factorData.filter((data) => {
        return data.type !== '' && data.subtype !== '';
    });

    return factorDataFiltered.map((data, index) => {
        // Key objective: convert the FactorData into a row entry. First, we must do some checks:
        // Determine if this is a solid or a liquid
        // Liquids contribute volume directly
        // Solids contribute some displacement volume (mL . g^(-1))

        // Oops, I got myself into a slight pickle by making this an optional data field.
        const i: number = parseInt(data.type?.[1] ?? "0");

        // This forms a partition (well, basically) since we assume things are valid from here
        const isLiquid: boolean = ((i === 1) || (i === 2));

        const dbEntry: IDBEntry = db_at_home[data.subtype!];
        const scaler: number = (isLiquid ? data.mL! : data.g!);

        let volumeScaler: number = scaler;

        // Patch for liquid with some solid added as directed, e.g. Similac 60/40 mixture.
        if (isLiquid && dbEntry.displacement > 0) {
            volumeScaler *= (1 + dbEntry.displacement);
        }

        return {
            formula_name: data.subtype,
            id: index,
            volume: volumeScaler,
            kcal: (dbEntry.cal_per_unit * scaler).toFixed(3),
            protein: (dbEntry.protein_per_unit * scaler).toFixed(3),
            calcium: (dbEntry.calcium_per_unit * scaler).toFixed(3),
            phosphorus: (dbEntry.phos_per_unit * scaler).toFixed(3),
            kalium: (dbEntry.kalium_per_unit * scaler).toFixed(3),
            sodium: (dbEntry.natrium_per_unit * scaler).toFixed(3),
            magnesium: (dbEntry.magnesium_per_unit * scaler).toFixed(3),
            retinol_iu: (dbEntry.retinol_per_unit * scaler).toFixed(3),
            vit_d_iu: (dbEntry.vit_d_per_unit * scaler).toFixed(3),
            carb: (dbEntry.carb_per_unit * scaler).toFixed(3),
            fat: (dbEntry.fat_per_unit * scaler).toFixed(3),
        };
    });
}

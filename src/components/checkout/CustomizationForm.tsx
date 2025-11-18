import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CustomizationData {
  name: string;
  theme: string;
  observations: string;
}

interface CustomizationFormProps {
  data: CustomizationData;
  setData: React.Dispatch<React.SetStateAction<CustomizationData>>;
  setFile: (file: File | null) => void;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ data, setData, setFile }) => (
  <div className="space-y-4 pt-6 mt-6 border-t">
    <h3 className="text-lg font-semibold">Detalhes para a Criação da Arte</h3>
    <div className="space-y-2">
      <Label htmlFor="customName">Nome para a Etiqueta</Label>
      <Input id="customName" placeholder="Ex: João Pedro" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="customTheme">Tema</Label>
      <Input id="customTheme" placeholder="Ex: Dinossauros, Fadas, etc." value={data.theme} onChange={(e) => setData({...data, theme: e.target.value})} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="customObservations">Observações</Label>
      <Textarea id="customObservations" placeholder="Alguma cor preferida, detalhe específico ou outra informação importante?" value={data.observations} onChange={(e) => setData({...data, observations: e.target.value})} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="customReference">Imagem de Referência (Opcional)</Label>
      <Input id="customReference" type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
    </div>
  </div>
);

export default CustomizationForm;

import {
  DEFAULT_INTENTION as ACCESS_INTENTION,
  DEFAULT_PURPOSE as ACCESS_PURPOSE,
  __ID__ as ACCESS_ID,
} from '@uca/access/constants';
import {
  DataType as AccessDataType,
  SignalType as AccessSignalType,
} from '@uca/access/types';
import {
  DEFAULT_INTENTION as ACTION_INTENTION,
  DEFAULT_PURPOSE as ACTION_PURPOSE,
  __ID__ as ACTION_ID,
} from '@uca/action/constants';
import {
  DataType as ActionDataType,
  SignalType as ActionSignalType,
} from '@uca/action/types';
import {
  DEFAULT_AIM_DESCRIPTION as APP_INTENTION,
  DEFAULT_PURPOSE as APP_PURPOSE,
  __ID__ as APP_ID,
} from '@uca/app/constants';
import { DataType as AppDataType } from '@uca/app/types';
import {
  DEFAULT_INTENTION as BOX_INTENTION,
  DEFAULT_PURPOSE as BOX_PURPOSE,
  __ID__ as BOX_ID,
} from '@uca/box/constants';
import {
  DataType as BoxDataType,
  SignalType as BoxSignalType,
} from '@uca/box/types';
import {
  DEFAULT_INTENTION as CARD_INTENTION,
  DEFAULT_PURPOSE as CARD_PURPOSE,
  __ID__ as CARD_ID,
} from '@uca/card/constants';
import {
  DataType as CardDataType,
  SignalType as CardSignalType,
} from '@uca/card/types';
import {
  DEFAULT_INTENTION as CHIP_INTENTION,
  DEFAULT_PURPOSE as CHIP_PURPOSE,
  __ID__ as CHIP_ID,
} from '@uca/chip/constants';
import {
  DataType as ChipDataType,
  SignalType as ChipSignalType,
} from '@uca/chip/types';
import {
  DEFAULT_INTENTION as CHOICE_INTENTION,
  DEFAULT_PURPOSE as CHOICE_PURPOSE,
  __ID__ as CHOICE_ID,
} from '@uca/choice/constants';
import {
  DataType as ChoiceDataType,
  SignalType as ChoiceSignalType,
} from '@uca/choice/types';
import {
  DEFAULT_INTENTION as COMPOSITION_INTENTION,
  DEFAULT_PURPOSE as COMPOSITION_PURPOSE,
  __ID__ as COMPOSITION_ID,
} from '@uca/composition/constants';
import {
  DataType as CompositionDataType,
  SignalType as CompositionSignalType,
} from '@uca/composition/types';
import { DispositionSignal } from '@uca/core/types';
import {
  DEFAULT_PURPOSE as DECISION_PURPOSE,
  INFERENCE_LIMITS as DECISION_LIMITS,
  __ID__ as DECISION_ID,
} from '@uca/decision/constants';
import {
  DataType as DecisionDataType,
  SignalType as DecisionSignalType,
} from '@uca/decision/types';
import {
  DEFAULT_INTENTION as DIALOG_INTENTION,
  DEFAULT_PURPOSE as DIALOG_PURPOSE,
  __ID__ as DIALOG_ID,
} from '@uca/dialog/constants';
import {
  DataType as DialogDataType,
  SignalType as DialogSignalType,
} from '@uca/dialog/types';
import {
  DEFAULT_INTENTION as HEADING_INTENTION,
  DEFAULT_PURPOSE as HEADING_PURPOSE,
  __ID__ as HEADING_ID,
} from '@uca/heading/constants';
import {
  DataType as HeadingDataType,
  SignalType as HeadingSignalType,
} from '@uca/heading/types';
import {
  DEFAULT_INTENTION as INPUT_INTENTION,
  DEFAULT_PURPOSE as INPUT_PURPOSE,
  __ID__ as INPUT_ID,
} from '@uca/input/constants';
import {
  DataType as InputDataType,
  SignalType as InputSignalType,
} from '@uca/input/types';
import {
  DEFAULT_INTENTION as LAYOUT_INTENTION,
  DEFAULT_LIMITS as LAYOUT_LIMITS,
  DEFAULT_PURPOSE as LAYOUT_PURPOSE,
  __ID__ as LAYOUT_ID,
} from '@uca/layout/constants';
import {
  DataType as LayoutDataType,
  SignalType as LayoutSignalType,
} from '@uca/layout/types';
import {
  DEFAULT_INTENTION as LIST_INTENTION,
  DEFAULT_PURPOSE as LIST_PURPOSE,
  __ID__ as LIST_ID,
} from '@uca/list/constants';
import {
  DataType as ListDataType,
  SignalType as ListSignalType,
} from '@uca/list/types';
import { __ID__ as LLM_ID } from '@uca/llm/constants';
import {
  DataType as LlmDataType,
  SignalType as LlmSignalType,
} from '@uca/llm/types';
import {
  DEFAULT_INTENTION as MOMENT_INTENTION,
  DEFAULT_PURPOSE as MOMENT_PURPOSE,
  __ID__ as MOMENT_ID,
} from '@uca/moment/constants';
import {
  DataType as MomentDataType,
  SignalType as MomentSignalType,
} from '@uca/moment/types';
import {
  DEFAULT_PURPOSE as NAVIGATE_PURPOSE,
  __ID__ as NAVIGATE_ID,
} from '@uca/navigate/constants';
import {
  DataType as NavigateDataType,
  SignalType as NavigateSignalType,
} from '@uca/navigate/types';
import {
  DEFAULT_INTENTION as PARAGRAPH_INTENTION,
  DEFAULT_PURPOSE as PARAGRAPH_PURPOSE,
  __ID__ as PARAGRAPH_ID,
} from '@uca/paragraph/constants';
import {
  DataType as ParagraphDataType,
  SignalType as ParagraphSignalType,
} from '@uca/paragraph/types';
import {
  DEFAULT_INTENTION as PICTURE_INTENTION,
  DEFAULT_PURPOSE as PICTURE_PURPOSE,
  __ID__ as PICTURE_ID,
} from '@uca/picture/constants';
import {
  DataType as PictureDataType,
  SignalType as PictureSignalType,
} from '@uca/picture/types';
import {
  DEFAULT_INTENTION as PROGRESS_INTENTION,
  DEFAULT_PURPOSE as PROGRESS_PURPOSE,
  __ID__ as PROGRESS_ID,
} from '@uca/progress/constants';
import {
  DataType as ProgressDataType,
  SignalType as ProgressSignalType,
} from '@uca/progress/types';
import {
  DEFAULT_INTENTION as QUANTITY_INTENTION,
  DEFAULT_PURPOSE as QUANTITY_PURPOSE,
  __ID__ as QUANTITY_ID,
} from '@uca/quantity/constants';
import {
  DataType as QuantityDataType,
  SignalType as QuantitySignalType,
} from '@uca/quantity/types';
import {
  DEFAULT_INTENTION as RANGE_INTENTION,
  DEFAULT_PURPOSE as RANGE_PURPOSE,
  __ID__ as RANGE_ID,
} from '@uca/range/constants';
import {
  DataType as RangeDataType,
  SignalType as RangeSignalType,
} from '@uca/range/types';
import {
  DEFAULT_INTENTION as SEPARATOR_INTENTION,
  DEFAULT_PURPOSE as SEPARATOR_PURPOSE,
  __ID__ as SEPARATOR_ID,
} from '@uca/separator/constants';
import {
  DataType as SeparatorDataType,
  SignalType as SeparatorSignalType,
} from '@uca/separator/types';
import {
  DEFAULT_INTENTION as SLIDER_INTENTION,
  DEFAULT_PURPOSE as SLIDER_PURPOSE,
  __ID__ as SLIDER_ID,
} from '@uca/slider/constants';
import {
  DataType as SliderDataType,
  SignalType as SliderSignalType,
} from '@uca/slider/types';
import {
  DEFAULT_INTENTION as STATUS_INTENTION,
  DEFAULT_PURPOSE as STATUS_PURPOSE,
  __ID__ as STATUS_ID,
} from '@uca/status/constants';
import {
  DataType as StatusDataType,
  SignalType as StatusSignalType,
} from '@uca/status/types';
import {
  DEFAULT_INTENTION as SYMBOL_INTENTION,
  DEFAULT_PURPOSE as SYMBOL_PURPOSE,
  __ID__ as SYMBOL_ID,
} from '@uca/symbol/constants';
import {
  DataType as SymbolDataType,
  SignalType as SymbolSignalType,
} from '@uca/symbol/types';
import {
  DEFAULT_INTENTION as TOAST_INTENTION,
  DEFAULT_PURPOSE as TOAST_PURPOSE,
  __ID__ as TOAST_ID,
} from '@uca/toast/constants';
import {
  DataType as ToastDataType,
  SignalType as ToastSignalType,
} from '@uca/toast/types';
import {
  DEFAULT_INTENTION as TOGGLE_INTENTION,
  DEFAULT_PURPOSE as TOGGLE_PURPOSE,
  __ID__ as TOGGLE_ID,
} from '@uca/toggle/constants';
import {
  DataType as ToggleDataType,
  SignalType as ToggleSignalType,
} from '@uca/toggle/types';
import type {
  ComponentType,
  LogicUcaDescriptor,
  WebUcaDescriptor,
} from './types.js';

export const __ID__ = 'view';

export const DEFAULT_AREA_ID = 'body';

export const COMPONENT_SEPARATOR = '@';

export const DEFAULT_PURPOSE =
  'Crear un área visual hija de un layout y definir su propósito, intención, funcionalidad y diseño esperado';

export const DEFAULT_INTENTION =
  'Definir y construir el área visual hija recibida de un layout estableciendo en primer lugar el propio contenedor del área (con id igual a context.area.id y component: box) y a continuación la jerarquía de elementos Web UCA que la componen. Para el área y para cada elemento Web UCA, definir un propósito inmutable acotado y directo (purpose: 1 frase breve de 4 a 12 palabras), sus cualidades de diseño esperado (qualities) y su intención de cómo debe exponerse (intention) articulando tres dimensiones: 1) Expectativa (qué expone —texto literal, icono, datos, ruta o valores— y qué resultado aporta al usuario), 2) Intención funcional (qué ocurre al situarse encima en over/hover, qué ocurre al hacer click o interactuar —abrir un dialog modal, mostrar toast, filtrar o navegar—, qué parámetros envía a otro componente por su id o UCA de lógica mediante outputs y cómo reacciona mediante inputs ante señales de otra UCA visual), y 3) Intención visual (color de texto textColor, superficie surface, tamaño de fuente textSize, peso fontWeight, forma shape, contorno outline y espaciado spacing en reposo, y a qué color o iluminación cambia en over/hover o activo), respetando el diseño global de la aplicación (context.specification), las áreas hermanas (context.siblingAreas), el catálogo de context.webUcas y context.logicUcas, y sus límites (limits).';

export const DEFAULT_LIMITS: readonly string[] = [
  'Respetar estrictamente el diseño global de la aplicación (context.specification) y los límites espaciales del contenedor padre (100dvh en raíz, overflow: hidden y cero desbordamiento) sin usar height: screen en elementos internos',
  'Ceñirse al propósito e intención del área visual hija (context.area) sin duplicar menús, cabeceras ni paneles que ya pertenezcan a las áreas hermanas (context.siblingAreas)',
  'Emitir en primer lugar el contenedor del área visual (id === context.area.id, component: box) seguido de sus elementos Web UCA hijos de forma que todo contenedor padre (box o card) preceda a sus hijos',
  'Definir para cada elemento un purpose acotado y directo (4 a 12 palabras) y una intention que exprese cómo debe exponerse en tres dimensiones: 1) Expectativa, 2) Intención funcional (over/hover, click, outputs hacia otro id e inputs desde otra UCA visual) y 3) Intención visual (fuente, colores y superficie base y cambio en over/hover)',
] as const;

export const RENDER_SIGNALS: Readonly<Record<ComponentType, string>> = {
  access: AccessSignalType.RENDER,
  action: ActionSignalType.RENDER,
  box: BoxSignalType.RENDER,
  card: CardSignalType.RENDER,
  chip: ChipSignalType.RENDER,
  choice: ChoiceSignalType.RENDER,
  dialog: DialogSignalType.RENDER,
  heading: HeadingSignalType.RENDER,
  input: InputSignalType.RENDER,
  list: ListSignalType.RENDER,
  moment: MomentSignalType.RENDER,
  paragraph: ParagraphSignalType.RENDER,
  picture: PictureSignalType.RENDER,
  progress: ProgressSignalType.RENDER,
  quantity: QuantitySignalType.RENDER,
  range: RangeSignalType.RENDER,
  separator: SeparatorSignalType.RENDER,
  slider: SliderSignalType.RENDER,
  status: StatusSignalType.RENDER,
  symbol: SymbolSignalType.RENDER,
  toast: ToastSignalType.RENDER,
  toggle: ToggleSignalType.RENDER,
} as const;

export const WEB_UCAS: readonly WebUcaDescriptor[] = [
  {
    purpose: BOX_PURPOSE,
    intention: BOX_INTENTION,
    component: BOX_ID,
    limits: [
      'Contenedor estructural puro sin texto propio directo (sin content)',
      'Debe declarar cualidades espaciales (direction o division, gap, alignment, distribution) para organizar a sus componentes hijos sin desbordamiento',
    ],
    inputs: [
      {
        signal: BoxSignalType.RENDER,
        type: BoxDataType.BODY,
        description: 'Materializar el contenedor espacial en el DOM aplicando sus cualidades y estado de skeleton',
      },
      {
        signal: BoxSignalType.UPDATE,
        type: BoxDataType.BODY,
        description: 'Actualizar las cualidades o el estado de skeleton del contenedor espacial',
      },
      {
        signal: BoxSignalType.REMOVE,
        type: BoxDataType.BODY,
        description: 'Eliminar el contenedor espacial y sus reglas de estilo asociadas del DOM',
      },
    ],
    outputs: [
      {
        signal: BoxSignalType.CREATED,
        type: BoxDataType.BODY,
        description: 'Contenedor espacial creado y estilizado en el DOM',
      },
      {
        signal: BoxSignalType.UPDATED,
        type: BoxDataType.BODY,
        description: 'Contenedor espacial actualizado en el DOM',
      },
      {
        signal: BoxSignalType.REMOVED,
        type: BoxDataType.BODY,
        description: 'Contenedor espacial eliminado del DOM',
      },
      {
        signal: BoxSignalType.EVENT,
        type: BoxDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde el contenedor espacial',
      },
      {
        signal: BoxSignalType.ERROR,
        type: BoxDataType.ERROR,
        description: 'Error emitido durante la operación del contenedor espacial',
      },
    ],
  },
  {
    purpose: CARD_PURPOSE,
    intention: CARD_INTENTION,
    component: CARD_ID,
    limits: [
      'Contenedor tonal de superficie Material Design 3 sin texto propio directo (sin content)',
      'Agrupa componentes hijos temáticamente cohesionados (heading, paragraph, symbol, status, list, action) respetando el espacio disponible',
    ],
    inputs: [
      {
        signal: CardSignalType.RENDER,
        type: CardDataType.BODY,
        description: 'Materializar la tarjeta en el DOM aplicando sus cualidades visuales Material Design 3',
      },
      {
        signal: CardSignalType.UPDATE,
        type: CardDataType.BODY,
        description: 'Actualizar las cualidades visuales de la tarjeta',
      },
      {
        signal: CardSignalType.REMOVE,
        type: CardDataType.BODY,
        description: 'Eliminar la tarjeta y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: CardSignalType.CREATED,
        type: CardDataType.BODY,
        description: 'Tarjeta creada y estilizada en el DOM',
      },
      {
        signal: CardSignalType.UPDATED,
        type: CardDataType.BODY,
        description: 'Tarjeta actualizada en el DOM',
      },
      {
        signal: CardSignalType.REMOVED,
        type: CardDataType.BODY,
        description: 'Tarjeta eliminada del DOM',
      },
      {
        signal: CardSignalType.EVENT,
        type: CardDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde la tarjeta',
      },
      {
        signal: CardSignalType.ERROR,
        type: CardDataType.ERROR,
        description: 'Error emitido durante la operación de la tarjeta',
      },
    ],
  },
  {
    purpose: LIST_PURPOSE,
    intention: LIST_INTENTION,
    component: LIST_ID,
    limits: [
      'Requiere una colección no vacía de entradas en items inferida según su propósito e intención',
      'Acotar el número de ítems visibles para no desbordar la altura del contenedor padre',
    ],
    inputs: [
      {
        signal: ListSignalType.RENDER,
        type: ListDataType.BODY,
        description: 'Materializar la lista en el DOM aplicando sus elementos items y cualidades visuales',
      },
      {
        signal: ListSignalType.UPDATE,
        type: ListDataType.BODY,
        description: 'Actualizar la colección de elementos items o las cualidades visuales de la lista',
      },
      {
        signal: ListSignalType.REMOVE,
        type: ListDataType.BODY,
        description: 'Eliminar la lista y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ListSignalType.CREATED,
        type: ListDataType.BODY,
        description: 'Lista creada y estilizada en el DOM',
      },
      {
        signal: ListSignalType.UPDATED,
        type: ListDataType.BODY,
        description: 'Lista actualizada en el DOM',
      },
      {
        signal: ListSignalType.REMOVED,
        type: ListDataType.BODY,
        description: 'Lista eliminada del DOM',
      },
      {
        signal: ListSignalType.EVENT,
        type: ListDataType.EVENT_CONTEXT,
        description: 'Evento de selección o interacción emitido desde un elemento de la lista',
      },
      {
        signal: ListSignalType.ERROR,
        type: ListDataType.ERROR,
        description: 'Error emitido durante la operación de la lista',
      },
    ],
  },
  {
    purpose: HEADING_PURPOSE,
    intention: HEADING_INTENTION,
    component: HEADING_ID,
    limits: [
      'Requiere texto visible conciso en content y nivel jerárquico semántico en importance (1 a 6)',
      'No emplear para párrafos extensos ni descripciones multilínea',
    ],
    inputs: [
      {
        signal: HeadingSignalType.RENDER,
        type: HeadingDataType.BODY,
        description: 'Materializar el encabezado en el DOM aplicando su texto e importancia semántica',
      },
      {
        signal: HeadingSignalType.UPDATE,
        type: HeadingDataType.BODY,
        description: 'Actualizar el texto, importancia o cualidades visuales del encabezado',
      },
      {
        signal: HeadingSignalType.REMOVE,
        type: HeadingDataType.BODY,
        description: 'Eliminar el encabezado y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: HeadingSignalType.CREATED,
        type: HeadingDataType.BODY,
        description: 'Encabezado creado y estilizado en el DOM',
      },
      {
        signal: HeadingSignalType.UPDATED,
        type: HeadingDataType.BODY,
        description: 'Encabezado actualizado en el DOM',
      },
      {
        signal: HeadingSignalType.REMOVED,
        type: HeadingDataType.BODY,
        description: 'Encabezado eliminado del DOM',
      },
      {
        signal: HeadingSignalType.EVENT,
        type: HeadingDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde el encabezado',
      },
      {
        signal: HeadingSignalType.ERROR,
        type: HeadingDataType.ERROR,
        description: 'Error emitido durante la operación del encabezado',
      },
    ],
  },
  {
    purpose: PARAGRAPH_PURPOSE,
    intention: PARAGRAPH_INTENTION,
    component: PARAGRAPH_ID,
    limits: [
      'Requiere texto explicativo o descriptivo en content con extensión acorde al espacio de su contenedor',
      'Mantener ancho de lectura legible evitando desbordar verticalmente la tarjeta o área padre',
    ],
    inputs: [
      {
        signal: ParagraphSignalType.RENDER,
        type: ParagraphDataType.BODY,
        description: 'Materializar el párrafo en el DOM aplicando su contenido textual y cualidades visuales',
      },
      {
        signal: ParagraphSignalType.UPDATE,
        type: ParagraphDataType.BODY,
        description: 'Actualizar el texto o las cualidades visuales del párrafo',
      },
      {
        signal: ParagraphSignalType.REMOVE,
        type: ParagraphDataType.BODY,
        description: 'Eliminar el párrafo y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ParagraphSignalType.CREATED,
        type: ParagraphDataType.BODY,
        description: 'Párrafo creado y estilizado en el DOM',
      },
      {
        signal: ParagraphSignalType.UPDATED,
        type: ParagraphDataType.BODY,
        description: 'Párrafo actualizado en el DOM',
      },
      {
        signal: ParagraphSignalType.REMOVED,
        type: ParagraphDataType.BODY,
        description: 'Párrafo eliminado del DOM',
      },
      {
        signal: ParagraphSignalType.EVENT,
        type: ParagraphDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde el párrafo',
      },
      {
        signal: ParagraphSignalType.ERROR,
        type: ParagraphDataType.ERROR,
        description: 'Error emitido durante la operación del párrafo',
      },
    ],
  },
  {
    purpose: SEPARATOR_PURPOSE,
    intention: SEPARATOR_INTENTION,
    component: SEPARATOR_ID,
    limits: [
      'Elemento divisor puramente visual y semántico sin texto propio (sin content)',
      'Usar con moderación entre grupos funcionales diferenciados',
    ],
    inputs: [
      {
        signal: SeparatorSignalType.RENDER,
        type: SeparatorDataType.BODY,
        description: 'Materializar el separador en el DOM aplicando sus cualidades visuales',
      },
      {
        signal: SeparatorSignalType.UPDATE,
        type: SeparatorDataType.BODY,
        description: 'Actualizar las cualidades visuales del separador',
      },
      {
        signal: SeparatorSignalType.REMOVE,
        type: SeparatorDataType.BODY,
        description: 'Eliminar el separador y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: SeparatorSignalType.CREATED,
        type: SeparatorDataType.BODY,
        description: 'Separador creado y estilizado en el DOM',
      },
      {
        signal: SeparatorSignalType.UPDATED,
        type: SeparatorDataType.BODY,
        description: 'Separador actualizado en el DOM',
      },
      {
        signal: SeparatorSignalType.REMOVED,
        type: SeparatorDataType.BODY,
        description: 'Separador eliminado del DOM',
      },
      {
        signal: SeparatorSignalType.EVENT,
        type: SeparatorDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde el separador',
      },
      {
        signal: SeparatorSignalType.ERROR,
        type: SeparatorDataType.ERROR,
        description: 'Error emitido durante la operación del separador',
      },
    ],
  },
  {
    purpose: SYMBOL_PURPOSE,
    intention: SYMBOL_INTENTION,
    component: SYMBOL_ID,
    limits: [
      'El campo content debe ser exclusivamente un identificador snake_case válido en inglés de Material Symbols Outlined (ej. hub, memory, bolt, tune, sync, account_tree, visibility, layers, code,auto_awesome)',
      'Requiere descripción accesible en label',
    ],
    inputs: [
      {
        signal: SymbolSignalType.RENDER,
        type: SymbolDataType.BODY,
        description: 'Materializar el símbolo icónico Material Symbols en el DOM',
      },
      {
        signal: SymbolSignalType.UPDATE,
        type: SymbolDataType.BODY,
        description: 'Actualizar el glifo icónico, etiqueta accesible o cualidades visuales del símbolo',
      },
      {
        signal: SymbolSignalType.REMOVE,
        type: SymbolDataType.BODY,
        description: 'Eliminar el símbolo y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: SymbolSignalType.CREATED,
        type: SymbolDataType.BODY,
        description: 'Símbolo icónico creado y estilizado en el DOM',
      },
      {
        signal: SymbolSignalType.UPDATED,
        type: SymbolDataType.BODY,
        description: 'Símbolo icónico actualizado en el DOM',
      },
      {
        signal: SymbolSignalType.REMOVED,
        type: SymbolDataType.BODY,
        description: 'Símbolo icónico eliminado del DOM',
      },
      {
        signal: SymbolSignalType.EVENT,
        type: SymbolDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde el símbolo icónico',
      },
      {
        signal: SymbolSignalType.ERROR,
        type: SymbolDataType.ERROR,
        description: 'Error emitido durante la operación del símbolo icónico',
      },
    ],
  },
  {
    purpose: STATUS_PURPOSE,
    intention: STATUS_INTENTION,
    component: STATUS_ID,
    limits: [
      'Requiere etiqueta concisa en content y matiz semántico en tone (success, info, warning, error, neutral)',
      'Mantener width: content y shape: full para preservar su fisonomía de insignia Material Design 3',
    ],
    inputs: [
      {
        signal: StatusSignalType.RENDER,
        type: StatusDataType.BODY,
        description: 'Materializar la insignia de estado en el DOM aplicando su tono y etiqueta',
      },
      {
        signal: StatusSignalType.UPDATE,
        type: StatusDataType.BODY,
        description: 'Actualizar la etiqueta, el tono semántico o las cualidades visuales del estado',
      },
      {
        signal: StatusSignalType.REMOVE,
        type: StatusDataType.BODY,
        description: 'Eliminar la insignia de estado y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: StatusSignalType.CREATED,
        type: StatusDataType.BODY,
        description: 'Insignia de estado creada y estilizada en el DOM',
      },
      {
        signal: StatusSignalType.UPDATED,
        type: StatusDataType.BODY,
        description: 'Insignia de estado actualizada en el DOM',
      },
      {
        signal: StatusSignalType.REMOVED,
        type: StatusDataType.BODY,
        description: 'Insignia de estado eliminada del DOM',
      },
      {
        signal: StatusSignalType.EVENT,
        type: StatusDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde la insignia de estado',
      },
      {
        signal: StatusSignalType.ERROR,
        type: StatusDataType.ERROR,
        description: 'Error emitido durante la operación de la insignia de estado',
      },
    ],
  },
  {
    purpose: PROGRESS_PURPOSE,
    intention: PROGRESS_INTENTION,
    component: PROGRESS_ID,
    limits: [
      'Requiere valor numérico actual en value comprendido entre 0 y total (por defecto 100) y etiqueta accesible en label',
    ],
    inputs: [
      {
        signal: ProgressSignalType.RENDER,
        type: ProgressDataType.BODY,
        description: 'Materializar el indicador de progreso en el DOM aplicando su valor y escala total',
      },
      {
        signal: ProgressSignalType.UPDATE,
        type: ProgressDataType.BODY,
        description: 'Actualizar el valor de avance, el total o las cualidades visuales del progreso',
      },
      {
        signal: ProgressSignalType.REMOVE,
        type: ProgressDataType.BODY,
        description: 'Eliminar el indicador de progreso y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ProgressSignalType.CREATED,
        type: ProgressDataType.BODY,
        description: 'Indicador de progreso creado y estilizado en el DOM',
      },
      {
        signal: ProgressSignalType.UPDATED,
        type: ProgressDataType.BODY,
        description: 'Indicador de progreso actualizado en el DOM',
      },
      {
        signal: ProgressSignalType.REMOVED,
        type: ProgressDataType.BODY,
        description: 'Indicador de progreso eliminado del DOM',
      },
      {
        signal: ProgressSignalType.EVENT,
        type: ProgressDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde el indicador de progreso',
      },
      {
        signal: ProgressSignalType.ERROR,
        type: ProgressDataType.ERROR,
        description: 'Error emitido durante la operación del indicador de progreso',
      },
    ],
  },
  {
    purpose: PICTURE_PURPOSE,
    intention: PICTURE_INTENTION,
    component: PICTURE_ID,
    limits: [
      'Requiere recurso gráfico válido en src y descripción alternativa accesible en alt o label',
      'Contener sus dimensiones con overflow: hidden y shape redondeado Material Design 3',
    ],
    inputs: [
      {
        signal: PictureSignalType.RENDER,
        type: PictureDataType.BODY,
        description: 'Materializar el recurso gráfico en el DOM aplicando su origen y descripción alternativa',
      },
      {
        signal: PictureSignalType.UPDATE,
        type: PictureDataType.BODY,
        description: 'Actualizar el origen gráfico, texto alternativo o cualidades visuales de la imagen',
      },
      {
        signal: PictureSignalType.REMOVE,
        type: PictureDataType.BODY,
        description: 'Eliminar la imagen y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: PictureSignalType.CREATED,
        type: PictureDataType.BODY,
        description: 'Imagen creada y estilizada en el DOM',
      },
      {
        signal: PictureSignalType.UPDATED,
        type: PictureDataType.BODY,
        description: 'Imagen actualizada en el DOM',
      },
      {
        signal: PictureSignalType.REMOVED,
        type: PictureDataType.BODY,
        description: 'Imagen eliminada del DOM',
      },
      {
        signal: PictureSignalType.EVENT,
        type: PictureDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde la imagen',
      },
      {
        signal: PictureSignalType.ERROR,
        type: PictureDataType.ERROR,
        description: 'Error emitido durante la operación de la imagen',
      },
    ],
  },
  {
    purpose: CHIP_PURPOSE,
    intention: CHIP_INTENTION,
    component: CHIP_ID,
    limits: [
      'Requiere etiqueta breve en content (1 a 3 palabras) y estado booleano opcional en selected',
      'Agrupar dentro de contenedores en fila (direction: row) para barras de filtros o facetas Material Design 3',
    ],
    inputs: [
      {
        signal: ChipSignalType.RENDER,
        type: ChipDataType.BODY,
        description: 'Materializar el chip interactivo en el DOM aplicando su etiqueta y estado de selección',
      },
      {
        signal: ChipSignalType.UPDATE,
        type: ChipDataType.BODY,
        description: 'Actualizar la etiqueta, estado seleccionado o cualidades visuales del chip',
      },
      {
        signal: ChipSignalType.REMOVE,
        type: ChipDataType.BODY,
        description: 'Eliminar el chip y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ChipSignalType.CREATED,
        type: ChipDataType.BODY,
        description: 'Chip creado y estilizado en el DOM',
      },
      {
        signal: ChipSignalType.UPDATED,
        type: ChipDataType.BODY,
        description: 'Chip actualizado en el DOM',
      },
      {
        signal: ChipSignalType.REMOVED,
        type: ChipDataType.BODY,
        description: 'Chip eliminado del DOM',
      },
      {
        signal: ChipSignalType.EVENT,
        type: ChipDataType.EVENT_CONTEXT,
        description: 'Evento de filtrado o conmutación emitido al interactuar con el chip',
      },
      {
        signal: ChipSignalType.ERROR,
        type: ChipDataType.ERROR,
        description: 'Error emitido durante la operación del chip',
      },
    ],
  },
  {
    purpose: ACTION_PURPOSE,
    intention: ACTION_INTENTION,
    component: ACTION_ID,
    limits: [
      'Requiere verbo de acción explícito en content e identificador semántico de comando en action',
      'Evitar estirar verticalmente (usar height: content o medium y width: content salvo botones de ancho completo justificados)',
    ],
    inputs: [
      {
        signal: ActionSignalType.RENDER,
        type: ActionDataType.BODY,
        description: 'Materializar el control de acción en el DOM aplicando su etiqueta y cualidades visuales',
      },
      {
        signal: ActionSignalType.UPDATE,
        type: ActionDataType.BODY,
        description: 'Actualizar la etiqueta, estado o cualidades visuales del control de acción',
      },
      {
        signal: ActionSignalType.REMOVE,
        type: ActionDataType.BODY,
        description: 'Eliminar el control de acción y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ActionSignalType.CREATED,
        type: ActionDataType.BODY,
        description: 'Control de acción creado y estilizado en el DOM',
      },
      {
        signal: ActionSignalType.UPDATED,
        type: ActionDataType.BODY,
        description: 'Control de acción actualizado en el DOM',
      },
      {
        signal: ActionSignalType.REMOVED,
        type: ActionDataType.BODY,
        description: 'Control de acción eliminado del DOM',
      },
      {
        signal: ActionSignalType.EVENT,
        type: ActionDataType.EVENT_CONTEXT,
        description: 'Evento de disparo emitido al pulsar el control de acción para activar UCAs de lógica o actualizar vistas',
      },
      {
        signal: ActionSignalType.ERROR,
        type: ActionDataType.ERROR,
        description: 'Error emitido durante la operación del control de acción',
      },
    ],
  },
  {
    purpose: ACCESS_PURPOSE,
    intention: ACCESS_INTENTION,
    component: ACCESS_ID,
    limits: [
      'Requiere texto de navegación claro en content y ruta semántica destino en destination (ej. /core, /uca, /capability, /disposition, /signal)',
      'Coordinar su salida access.event con navigate.go de la UCA de lógica Navigate',
    ],
    inputs: [
      {
        signal: AccessSignalType.RENDER,
        type: AccessDataType.BODY,
        description: 'Materializar el enlace de acceso en el DOM aplicando su destino y cualidades visuales',
      },
      {
        signal: AccessSignalType.UPDATE,
        type: AccessDataType.BODY,
        description: 'Actualizar el texto, destino o cualidades visuales del enlace de acceso',
      },
      {
        signal: AccessSignalType.REMOVE,
        type: AccessDataType.BODY,
        description: 'Eliminar el enlace de acceso y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: AccessSignalType.CREATED,
        type: AccessDataType.BODY,
        description: 'Enlace de acceso creado y estilizado en el DOM',
      },
      {
        signal: AccessSignalType.UPDATED,
        type: AccessDataType.BODY,
        description: 'Enlace de acceso actualizado en el DOM',
      },
      {
        signal: AccessSignalType.REMOVED,
        type: AccessDataType.BODY,
        description: 'Enlace de acceso eliminado del DOM',
      },
      {
        signal: AccessSignalType.EVENT,
        type: AccessDataType.EVENT_CONTEXT,
        description: 'Evento de navegación emitido al activar el enlace para coordinar navigate.go',
      },
      {
        signal: AccessSignalType.ERROR,
        type: AccessDataType.ERROR,
        description: 'Error emitido durante la operación del enlace de acceso',
      },
    ],
  },
  {
    purpose: INPUT_PURPOSE,
    intention: INPUT_INTENTION,
    component: INPUT_ID,
    limits: [
      'Requiere guía contextual en placeholder y etiqueta accesible en label',
      'Emite input.event con el texto introducido para filtrar vistas, consultar memoria o disparar inferencias',
    ],
    inputs: [
      {
        signal: InputSignalType.RENDER,
        type: InputDataType.BODY,
        description: 'Materializar el campo de entrada de texto en el DOM aplicando su placeholder y etiqueta',
      },
      {
        signal: InputSignalType.UPDATE,
        type: InputDataType.BODY,
        description: 'Actualizar el valor, placeholder, estado o cualidades visuales del campo de texto',
      },
      {
        signal: InputSignalType.REMOVE,
        type: InputDataType.BODY,
        description: 'Eliminar el campo de texto y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: InputSignalType.CREATED,
        type: InputDataType.BODY,
        description: 'Campo de texto creado y estilizado en el DOM',
      },
      {
        signal: InputSignalType.UPDATED,
        type: InputDataType.BODY,
        description: 'Campo de texto actualizado en el DOM',
      },
      {
        signal: InputSignalType.REMOVED,
        type: InputDataType.BODY,
        description: 'Campo de texto eliminado del DOM',
      },
      {
        signal: InputSignalType.EVENT,
        type: InputDataType.EVENT_CONTEXT,
        description: 'Evento de entrada o cambio de texto emitido con el valor capturado',
      },
      {
        signal: InputSignalType.ERROR,
        type: InputDataType.ERROR,
        description: 'Error emitido durante la operación del campo de texto',
      },
    ],
  },
  {
    purpose: TOGGLE_PURPOSE,
    intention: TOGGLE_INTENTION,
    component: TOGGLE_ID,
    limits: [
      'Requiere estado booleano en value (true o false) y descripción accesible en label',
      'Agrupar junto a una etiqueta visible (paragraph o heading) en un box con direction: row y alignment: center',
    ],
    inputs: [
      {
        signal: ToggleSignalType.RENDER,
        type: ToggleDataType.BODY,
        description: 'Materializar el conmutador booleano en el DOM aplicando su estado y etiqueta accesible',
      },
      {
        signal: ToggleSignalType.UPDATE,
        type: ToggleDataType.BODY,
        description: 'Actualizar el estado booleano o las cualidades visuales del conmutador',
      },
      {
        signal: ToggleSignalType.REMOVE,
        type: ToggleDataType.BODY,
        description: 'Eliminar el conmutador y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ToggleSignalType.CREATED,
        type: ToggleDataType.BODY,
        description: 'Conmutador booleano creado y estilizado en el DOM',
      },
      {
        signal: ToggleSignalType.UPDATED,
        type: ToggleDataType.BODY,
        description: 'Conmutador booleano actualizado en el DOM',
      },
      {
        signal: ToggleSignalType.REMOVED,
        type: ToggleDataType.BODY,
        description: 'Conmutador booleano eliminado del DOM',
      },
      {
        signal: ToggleSignalType.EVENT,
        type: ToggleDataType.EVENT_CONTEXT,
        description: 'Evento de conmutación emitido con el nuevo estado booleano checked',
      },
      {
        signal: ToggleSignalType.ERROR,
        type: ToggleDataType.ERROR,
        description: 'Error emitido durante la operación del conmutador booleano',
      },
    ],
  },
  {
    purpose: CHOICE_PURPOSE,
    intention: CHOICE_INTENTION,
    component: CHOICE_ID,
    limits: [
      'Requiere lista no vacía de opciones en items, opción activa coherente en value y nombre accesible en label',
    ],
    inputs: [
      {
        signal: ChoiceSignalType.RENDER,
        type: ChoiceDataType.BODY,
        description: 'Materializar el selector desplegable en el DOM aplicando sus opciones items y valor activo',
      },
      {
        signal: ChoiceSignalType.UPDATE,
        type: ChoiceDataType.BODY,
        description: 'Actualizar las opciones items, el valor seleccionado o las cualidades visuales del selector',
      },
      {
        signal: ChoiceSignalType.REMOVE,
        type: ChoiceDataType.BODY,
        description: 'Eliminar el selector desplegable y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ChoiceSignalType.CREATED,
        type: ChoiceDataType.BODY,
        description: 'Selector desplegable creado y estilizado en el DOM',
      },
      {
        signal: ChoiceSignalType.UPDATED,
        type: ChoiceDataType.BODY,
        description: 'Selector desplegable actualizado en el DOM',
      },
      {
        signal: ChoiceSignalType.REMOVED,
        type: ChoiceDataType.BODY,
        description: 'Selector desplegable eliminado del DOM',
      },
      {
        signal: ChoiceSignalType.EVENT,
        type: ChoiceDataType.EVENT_CONTEXT,
        description: 'Evento de cambio de selección emitido con la opción elegida en value',
      },
      {
        signal: ChoiceSignalType.ERROR,
        type: ChoiceDataType.ERROR,
        description: 'Error emitido durante la operación del selector desplegable',
      },
    ],
  },
  {
    purpose: SLIDER_PURPOSE,
    intention: SLIDER_INTENTION,
    component: SLIDER_ID,
    limits: [
      'Requiere cotas numéricas coherentes (minimum < maximum), valor inicial dentro del rango en value y etiqueta en label',
    ],
    inputs: [
      {
        signal: SliderSignalType.RENDER,
        type: SliderDataType.BODY,
        description: 'Materializar el control deslizante en el DOM aplicando su rango y valor inicial',
      },
      {
        signal: SliderSignalType.UPDATE,
        type: SliderDataType.BODY,
        description: 'Actualizar el valor, límites o cualidades visuales del control deslizante',
      },
      {
        signal: SliderSignalType.REMOVE,
        type: SliderDataType.BODY,
        description: 'Eliminar el control deslizante y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: SliderSignalType.CREATED,
        type: SliderDataType.BODY,
        description: 'Control deslizante creado y estilizado en el DOM',
      },
      {
        signal: SliderSignalType.UPDATED,
        type: SliderDataType.BODY,
        description: 'Control deslizante actualizado en el DOM',
      },
      {
        signal: SliderSignalType.REMOVED,
        type: SliderDataType.BODY,
        description: 'Control deslizante eliminado del DOM',
      },
      {
        signal: SliderSignalType.EVENT,
        type: SliderDataType.EVENT_CONTEXT,
        description: 'Evento de ajuste continuo emitido con la magnitud seleccionada en value',
      },
      {
        signal: SliderSignalType.ERROR,
        type: SliderDataType.ERROR,
        description: 'Error emitido durante la operación del control deslizante',
      },
    ],
  },
  {
    purpose: RANGE_PURPOSE,
    intention: RANGE_INTENTION,
    component: RANGE_ID,
    limits: [
      'Requiere cotas minimum y maximum definidas, paso step positivo, valor actual en value y nombre accesible en label',
    ],
    inputs: [
      {
        signal: RangeSignalType.RENDER,
        type: RangeDataType.BODY,
        description: 'Materializar el control de intervalo en el DOM aplicando sus cotas y valor',
      },
      {
        signal: RangeSignalType.UPDATE,
        type: RangeDataType.BODY,
        description: 'Actualizar las cotas, el valor o las cualidades visuales del intervalo',
      },
      {
        signal: RangeSignalType.REMOVE,
        type: RangeDataType.BODY,
        description: 'Eliminar el control de intervalo y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: RangeSignalType.CREATED,
        type: RangeDataType.BODY,
        description: 'Control de intervalo creado y estilizado en el DOM',
      },
      {
        signal: RangeSignalType.UPDATED,
        type: RangeDataType.BODY,
        description: 'Control de intervalo actualizado en el DOM',
      },
      {
        signal: RangeSignalType.REMOVED,
        type: RangeDataType.BODY,
        description: 'Control de intervalo eliminado del DOM',
      },
      {
        signal: RangeSignalType.EVENT,
        type: RangeDataType.EVENT_CONTEXT,
        description: 'Evento de ajuste de umbral emitido desde el control de intervalo',
      },
      {
        signal: RangeSignalType.ERROR,
        type: RangeDataType.ERROR,
        description: 'Error emitido durante la operación del control de intervalo',
      },
    ],
  },
  {
    purpose: QUANTITY_PURPOSE,
    intention: QUANTITY_INTENTION,
    component: QUANTITY_ID,
    limits: [
      'Requiere magnitud numérica en value, unidad semántica opcional en unit, cotas minimum/maximum y etiqueta en label',
    ],
    inputs: [
      {
        signal: QuantitySignalType.RENDER,
        type: QuantityDataType.BODY,
        description: 'Materializar el control de cantidad numérica en el DOM aplicando su valor y unidad',
      },
      {
        signal: QuantitySignalType.UPDATE,
        type: QuantityDataType.BODY,
        description: 'Actualizar el valor numérico, unidad, cotas o cualidades visuales de la cantidad',
      },
      {
        signal: QuantitySignalType.REMOVE,
        type: QuantityDataType.BODY,
        description: 'Eliminar el control de cantidad y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: QuantitySignalType.CREATED,
        type: QuantityDataType.BODY,
        description: 'Control de cantidad creado y estilizado en el DOM',
      },
      {
        signal: QuantitySignalType.UPDATED,
        type: QuantityDataType.BODY,
        description: 'Control de cantidad actualizado en el DOM',
      },
      {
        signal: QuantitySignalType.REMOVED,
        type: QuantityDataType.BODY,
        description: 'Control de cantidad eliminado del DOM',
      },
      {
        signal: QuantitySignalType.EVENT,
        type: QuantityDataType.EVENT_CONTEXT,
        description: 'Evento de cambio de magnitud numérica emitido desde el control de cantidad',
      },
      {
        signal: QuantitySignalType.ERROR,
        type: QuantityDataType.ERROR,
        description: 'Error emitido durante la operación del control de cantidad',
      },
    ],
  },
  {
    purpose: MOMENT_PURPOSE,
    intention: MOMENT_INTENTION,
    component: MOMENT_ID,
    limits: [
      'Requiere marca temporal ISO (YYYY-MM-DD) en value y etiqueta descriptiva en label',
    ],
    inputs: [
      {
        signal: MomentSignalType.RENDER,
        type: MomentDataType.BODY,
        description: 'Materializar el selector temporal en el DOM aplicando su fecha y cotas cronológicas',
      },
      {
        signal: MomentSignalType.UPDATE,
        type: MomentDataType.BODY,
        description: 'Actualizar la fecha, cotas o cualidades visuales del selector temporal',
      },
      {
        signal: MomentSignalType.REMOVE,
        type: MomentDataType.BODY,
        description: 'Eliminar el selector temporal y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: MomentSignalType.CREATED,
        type: MomentDataType.BODY,
        description: 'Selector temporal creado y estilizado en el DOM',
      },
      {
        signal: MomentSignalType.UPDATED,
        type: MomentDataType.BODY,
        description: 'Selector temporal actualizado en el DOM',
      },
      {
        signal: MomentSignalType.REMOVED,
        type: MomentDataType.BODY,
        description: 'Selector temporal eliminado del DOM',
      },
      {
        signal: MomentSignalType.EVENT,
        type: MomentDataType.EVENT_CONTEXT,
        description: 'Evento de cambio de referencia temporal emitido desde el selector',
      },
      {
        signal: MomentSignalType.ERROR,
        type: MomentDataType.ERROR,
        description: 'Error emitido durante la operación del selector temporal',
      },
    ],
  },
  {
    purpose: DIALOG_PURPOSE,
    intention: DIALOG_INTENTION,
    component: DIALOG_ID,
    limits: [
      'Requiere mensaje contextual en content y título opcional en title, reservado para avisos o inspecciones focalizadas',
    ],
    inputs: [
      {
        signal: DialogSignalType.RENDER,
        type: DialogDataType.BODY,
        description: 'Materializar el contenedor modal de diálogo en el DOM',
      },
      {
        signal: DialogSignalType.UPDATE,
        type: DialogDataType.BODY,
        description: 'Actualizar el contenido, estado de apertura o cualidades visuales del diálogo',
      },
      {
        signal: DialogSignalType.REMOVE,
        type: DialogDataType.BODY,
        description: 'Eliminar el diálogo y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: DialogSignalType.CREATED,
        type: DialogDataType.BODY,
        description: 'Diálogo creado y estilizado en el DOM',
      },
      {
        signal: DialogSignalType.UPDATED,
        type: DialogDataType.BODY,
        description: 'Diálogo actualizado en el DOM',
      },
      {
        signal: DialogSignalType.REMOVED,
        type: DialogDataType.BODY,
        description: 'Diálogo eliminado del DOM',
      },
      {
        signal: DialogSignalType.EVENT,
        type: DialogDataType.EVENT_CONTEXT,
        description: 'Evento de confirmación o cierre emitido desde el diálogo',
      },
      {
        signal: DialogSignalType.ERROR,
        type: DialogDataType.ERROR,
        description: 'Error emitido durante la operación del diálogo',
      },
    ],
  },
  {
    purpose: TOAST_PURPOSE,
    intention: TOAST_INTENTION,
    component: TOAST_ID,
    limits: [
      'Requiere mensaje breve no bloqueante en content y tono semántico en tone (info, success, warning, error, neutral)',
    ],
    inputs: [
      {
        signal: ToastSignalType.RENDER,
        type: ToastDataType.BODY,
        description: 'Materializar la notificación transitoria toast en el DOM',
      },
      {
        signal: ToastSignalType.UPDATE,
        type: ToastDataType.BODY,
        description: 'Actualizar el mensaje, tono o cualidades visuales de la notificación toast',
      },
      {
        signal: ToastSignalType.REMOVE,
        type: ToastDataType.BODY,
        description: 'Eliminar la notificación toast y sus estilos asociados del DOM',
      },
    ],
    outputs: [
      {
        signal: ToastSignalType.CREATED,
        type: ToastDataType.BODY,
        description: 'Notificación toast creada y estilizada en el DOM',
      },
      {
        signal: ToastSignalType.UPDATED,
        type: ToastDataType.BODY,
        description: 'Notificación toast actualizada en el DOM',
      },
      {
        signal: ToastSignalType.REMOVED,
        type: ToastDataType.BODY,
        description: 'Notificación toast eliminada del DOM',
      },
      {
        signal: ToastSignalType.EVENT,
        type: ToastDataType.EVENT_CONTEXT,
        description: 'Evento de interacción emitido desde la notificación toast',
      },
      {
        signal: ToastSignalType.ERROR,
        type: ToastDataType.ERROR,
        description: 'Error emitido durante la operación de la notificación toast',
      },
    ],
  },
] as const;

export const LOGIC_UCAS: readonly LogicUcaDescriptor[] = [
  {
    purpose: APP_PURPOSE,
    intention: APP_INTENTION,
    id: APP_ID,
    limits: [
      'Organismo raíz único que coordina sesión, navegación y composición cognitiva de la aplicación',
    ],
    inputs: [
      {
        signal: DispositionSignal.INNERVATED,
        type: AppDataType.VOID,
        description: 'Señal de ciclo de vida del Core emitida tras la inervación del organismo raíz',
      },
    ],
    outputs: [
      {
        signal: CompositionSignalType.COMPOSE,
        type: AppDataType.COMPOSE_REQUEST,
        description: 'Delegar la composición cognitiva para la ruta activa de la aplicación',
      },
      {
        signal: AppDataType.ERROR,
        type: AppDataType.ERROR,
        description: 'Error emitido durante la ejecución del ciclo de vida de la aplicación',
      },
    ],
  },
  {
    purpose: COMPOSITION_PURPOSE,
    intention: COMPOSITION_INTENTION,
    id: COMPOSITION_ID,
    limits: [
      'Profundidad máxima de partición fractal acotada (MAXIMUM_DEPTH = 2) para garantizar rendimiento y contención espacial',
      'Propaga a cada área su contexto, áreas hermanas y especificación global',
    ],
    inputs: [
      {
        signal: CompositionSignalType.COMPOSE,
        type: CompositionDataType.COMPOSE_REQUEST,
        description: 'Analizar la especificación y componer el área objetivo como Layout o View',
      },
    ],
    outputs: [
      {
        signal: CompositionSignalType.ERROR,
        type: CompositionDataType.ERROR,
        description: 'Error emitido durante la consulta de la especificación o la composición de áreas',
      },
    ],
  },
  {
    purpose: DECISION_PURPOSE,
    intention: 'Evaluar probabilísticamente preguntas de elección (LAYOUT vs VIEW o selección de candidatos) asignando pesos normalizados que sumen 1 y valorando el potencial emergente dentro de los límites del sistema',
    id: DECISION_ID,
    limits: [
      ...DECISION_LIMITS,
    ],
    inputs: [
      {
        signal: DecisionSignalType.DECIDE,
        type: DecisionDataType.REQUEST,
        description: 'Evaluar probabilísticamente una pregunta de elección y seleccionar un candidato',
      },
    ],
    outputs: [
      {
        signal: DecisionSignalType.DECIDED,
        type: DecisionDataType.RESULT,
        description: 'Decisión probabilística consolidada junto con sus pesos y confianza',
      },
      {
        signal: DecisionSignalType.ERROR,
        type: DecisionDataType.ERROR,
        description: 'Error emitido durante la evaluación o validación de la decisión',
      },
    ],
  },
  {
    purpose: LAYOUT_PURPOSE,
    intention: LAYOUT_INTENTION,
    id: LAYOUT_ID,
    limits: [
      ...LAYOUT_LIMITS,
    ],
    inputs: [
      {
        signal: LayoutSignalType.BUILD,
        type: LayoutDataType.BODY,
        description: 'Construir las particiones espaciales de áreas del layout para el contenedor objetivo',
      },
    ],
    outputs: [
      {
        signal: LayoutSignalType.AREA_CREATED,
        type: LayoutDataType.AREA_CREATED,
        description: 'Contenedor de área hija montado en el DOM y listo para composición',
      },
      {
        signal: LayoutSignalType.BUILT,
        type: LayoutDataType.BUILT_RESULT,
        description: 'Estructura de partición de áreas del layout completada',
      },
      {
        signal: LayoutSignalType.ERROR,
        type: LayoutDataType.ERROR,
        description: 'Error emitido durante la construcción del layout',
      },
    ],
  },
  {
    purpose: 'Solicitar inferencias cognitivas completas y en streaming a través del backend de la aplicación',
    intention: 'Validar contratos de inferencia (purpose, intention, limits, context, outputSchema) y ejecutar peticiones síncronas o flujos SSE hacia los modelos cognitivos',
    id: LLM_ID,
    limits: [
      'Requiere contrato válido con purpose, intention y outputSchema formal',
      'Opera mediante inferencia estructurada (llm.infer) o flujo continuo SSE (llm.stream)',
    ],
    inputs: [
      {
        signal: LlmSignalType.INFER,
        type: LlmDataType.INFER_PAYLOAD,
        description: 'Petición de inferencia estructurada con propósito, intención, límites, contexto y esquema de salida',
      },
      {
        signal: LlmSignalType.STREAM,
        type: LlmDataType.INFER_PAYLOAD,
        description: 'Petición de inferencia en streaming SSE con propósito, intención, límites, contexto y esquema de salida',
      },
      {
        signal: LlmSignalType.ABORT,
        type: LlmDataType.ABORT_PAYLOAD,
        description: 'Abortar inferencia en curso',
      },
      {
        signal: LlmSignalType.CONNECT,
        type: LlmDataType.VOID,
        description: 'Señal de conexión para comprobación de estado',
      },
    ],
    outputs: [
      {
        signal: LlmSignalType.INFERRED,
        type: LlmDataType.INFER_RESULT,
        description: 'Resultado de inferencia estructurada conforme al esquema de salida',
      },
      {
        signal: LlmSignalType.STREAMING,
        type: LlmDataType.UNKNOWN,
        description: 'Confirmación de inicio de sesión de streaming',
      },
      {
        signal: LlmSignalType.STREAMED,
        type: LlmDataType.STREAM_RESULT,
        description: 'Fuente activa de respuesta en streaming desde SSE',
      },
      {
        signal: LlmSignalType.STREAM_END,
        type: LlmDataType.STREAM_END_RESULT,
        description: 'Sesión de streaming completada',
      },
      {
        signal: LlmSignalType.CONNECTED,
        type: LlmDataType.STRING,
        description: 'Confirmación del estado de conexión',
      },
      {
        signal: LlmSignalType.ERROR,
        type: LlmDataType.UNKNOWN,
        description: 'Error de fallo de inferencia o incumplimiento de esquema',
      },
    ],
  },
  {
    purpose: NAVIGATE_PURPOSE,
    intention: 'Sincronizar las transiciones de ruta del usuario con el historial del navegador y persistir el recorrido de navegación en la sesión activa',
    id: NAVIGATE_ID,
    limits: [
      'Normaliza toda ruta al formato limpio /ruta y evita duplicar entradas consecutivas idénticas en el historial',
    ],
    inputs: [
      {
        signal: NavigateSignalType.INIT,
        type: NavigateDataType.NAVIGATE_INIT,
        description: 'Inicializar la sesión de navegación con la URL por defecto o restaurar la última ruta',
      },
      {
        signal: NavigateSignalType.GO,
        type: NavigateDataType.NAVIGATE_REQUEST,
        description: 'Navegar hacia la URL objetivo y sincronizar el historial del navegador',
      },
      {
        signal: NavigateSignalType.DESTROY,
        type: NavigateDataType.NAVIGATE_DESTROY,
        description: 'Limpiar el almacenamiento y estado de la sesión de navegación',
      },
    ],
    outputs: [
      {
        signal: NavigateSignalType.CHANGED,
        type: NavigateDataType.NAVIGATION_STATE,
        description: 'Estado de navegación activo actualizado con la nueva URL y la ruta previa',
      },
    ],
  },
] as const;

export const DEFAULT_IMAGINATION = 0.85;

export const INFER_CONTRACT = {
  purpose: DEFAULT_PURPOSE,
  intention: DEFAULT_INTENTION,
  imagination: DEFAULT_IMAGINATION,
  id: __ID__,
} as const;

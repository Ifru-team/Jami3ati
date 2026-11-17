import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import regionsData from 'morocco-map/data/regions.json';
import { University, Institution, Language } from '../types';
import { translations } from '../data/translations';
import {
  MapPin,
  Building2,
  GraduationCap,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  ExternalLink,
  X,
  ArrowRight,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import { getCoordinates, getOpenStreetMapDirectionsUrl } from '../utils/geoCoordinates';

interface CityData {
  id: string;
  name_ar: string;
  name_fr: string;
  region_id: string;
  region_ar: string;
  region_fr: string;
  coords: [number, number]; // [lon, lat]
  universities: University[];
  institutions: Institution[];
}

interface Props {
  universities: University[];
  institutions: Institution[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onSelectInstitution: (inst: Institution) => void;
  onSelectUniversity: (univ: University) => void;
  lang: Language;
}

// Coordinate mappings for academic centers located within Morocco's 12 administrative regions
const ACADEMIC_HUBS: { [key: string]: { coords: [number, number]; region_id: string; region_ar: string; region_fr: string } } = {
  'الرباط': { coords: [-6.8416, 34.0209], region_id: 'MA-04', region_ar: 'الرباط-سلا-القنيطرة', region_fr: 'Rabat-Salé-Kénitra' },
  'الدار البيضاء': { coords: [-7.5898, 33.5731], region_id: 'MA-06', region_ar: 'الدار البيضاء-سطات', region_fr: 'Casablanca-Settat' },
  'مراكش': { coords: [-7.9811, 31.6295], region_id: 'MA-07', region_ar: 'مراكش-أسفي', region_fr: 'Marrakech-Safi' },
  'فاس': { coords: [-5.0003, 34.0331], region_id: 'MA-03', region_ar: 'فاس-مكناس', region_fr: 'Fès-Meknès' },
  'مكناس': { coords: [-5.5473, 33.8938], region_id: 'MA-03', region_ar: 'فاس-مكناس', region_fr: 'Fès-Meknès' },
  'طنجة': { coords: [-5.8340, 35.7595], region_id: 'MA-01', region_ar: 'طنجة تطوان الحسيمة', region_fr: 'Tanger-Tétouan-Al Hoceïma' },
  'تطوان': { coords: [-5.3684, 35.5785], region_id: 'MA-01', region_ar: 'طنجة تطوان الحسيمة', region_fr: 'Tanger-Tétouan-Al Hoceïma' },
  'القنيطرة': { coords: [-6.5802, 34.2610], region_id: 'MA-04', region_ar: 'الرباط-سلا-القنيطرة', region_fr: 'Rabat-Salé-Kénitra' },
  'سطات': { coords: [-7.6166, 33.0010], region_id: 'MA-06', region_ar: 'الدار البيضاء-سطات', region_fr: 'Casablanca-Settat' },
  'الجديدة': { coords: [-8.5007, 33.2316], region_id: 'MA-06', region_ar: 'الدار البيضاء-سطات', region_fr: 'Casablanca-Settat' },
  'آسفي': { coords: [-9.2372, 32.2994], region_id: 'MA-07', region_ar: 'مراكش-أسفي', region_fr: 'Marrakech-Safi' },
  'أكادير': { coords: [-9.5981, 30.4278], region_id: 'MA-09', region_ar: 'سوس-ماسة', region_fr: 'Souss-Massa' },
  'تارودانت': { coords: [-8.8770, 30.4703], region_id: 'MA-09', region_ar: 'سوس-ماسة', region_fr: 'Souss-Massa' },
  'وجدة': { coords: [-1.9114, 34.6867], region_id: 'MA-02', region_ar: 'الشرقية', region_fr: 'L’Oriental' },
  'بني ملال': { coords: [-6.3533, 32.3394], region_id: 'MA-05', region_ar: 'بني ملال-خنيفرة', region_fr: 'Béni Mellal-Khénifra' },
  'العيون': { coords: [-13.2033, 27.1536], region_id: 'MA-11', region_ar: 'العيون الساقية الحمراء', region_fr: 'Laâyoune-Sakia El Hamra' },
  'الداخلة': { coords: [-15.9388, 23.7136], region_id: 'MA-12', region_ar: 'الداخلة-وادي الذهب', region_fr: 'Dakhla-Oued Ed-Dahab' },
  'الرشيدية': { coords: [-4.4285, 31.9315], region_id: 'MA-08', region_ar: 'درعة تافيلالت', region_fr: 'Drâa-Tafilalet' },
  'كلميم': { coords: [-10.0574, 28.9869], region_id: 'MA-10', region_ar: 'كلميم وادي نون', region_fr: 'Guelmim-Oued Noun' },
};

export const InteractiveMap: React.FC<Props> = ({
  universities,
  institutions,
  selectedCity,
  onSelectCity,
  onSelectInstitution,
  onSelectUniversity,
  lang,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [hoveredRegion, setHoveredRegion] = useState<{ id: string; name_ar: string; name_fr: string; count: number } | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);
  const [activeCityDetail, setActiveCityDetail] = useState<CityData | null>(null);

  const t = translations[lang];
  const isAr = lang === 'ar';

  // Convert TopoJSON to GeoJSON FeatureCollection using morocco-map
  const geojsonRegions: any = useMemo(() => {
    try {
      const topo: any = regionsData;
      const objectKey = Object.keys(topo.objects)[0];
      return topojson.feature(topo, topo.objects[objectKey]);
    } catch (err) {
      console.error('Error parsing TopoJSON from morocco-map:', err);
      return { type: 'FeatureCollection', features: [] };
    }
  }, []);

  // Map city data with universities and institutions
  const cityDataList: CityData[] = useMemo(() => {
    const map = new Map<string, CityData>();

    Object.entries(ACADEMIC_HUBS).forEach(([cityName, meta]) => {
      map.set(cityName, {
        id: cityName,
        name_ar: cityName,
        name_fr:
          cityName === 'الرباط' ? 'Rabat' :
          cityName === 'الدار البيضاء' ? 'Casablanca' :
          cityName === 'مراكش' ? 'Marrakech' :
          cityName === 'فاس' ? 'Fès' :
          cityName === 'مكناس' ? 'Meknès' :
          cityName === 'طنجة' ? 'Tanger' :
          cityName === 'تطوان' ? 'Tétouan' :
          cityName === 'القنيطرة' ? 'Kénitra' :
          cityName === 'سطات' ? 'Settat' :
          cityName === 'الجديدة' ? 'El Jadida' :
          cityName === 'آسفي' ? 'Safi' :
          cityName === 'أكادير' ? 'Agadir' :
          cityName === 'تارودانت' ? 'Taroudant' :
          cityName === 'وجدة' ? 'Oujda' :
          cityName === 'بني ملال' ? 'Béni Mellal' :
          cityName === 'العيون' ? 'Laâyoune' :
          cityName === 'الداخلة' ? 'Dakhla' :
          cityName === 'الرشيدية' ? 'Errachidia' :
          cityName === 'كلميم' ? 'Guelmim' : cityName,
        region_id: meta.region_id,
        region_ar: meta.region_ar,
        region_fr: meta.region_fr,
        coords: meta.coords,
        universities: universities.filter(
          (u) => u.city_ar === cityName || u.city_fr.toLowerCase() === cityName.toLowerCase()
        ),
        institutions: institutions.filter(
          (i) => i.city_ar === cityName || i.city_fr.toLowerCase() === cityName.toLowerCase()
        ),
      });
    });

    return Array.from(map.values()).filter((c) => c.universities.length > 0 || c.institutions.length > 0);
  }, [universities, institutions]);

  // Selected city object
  const currentActiveCity = useMemo(() => {
    if (selectedCity === 'all') return activeCityDetail;
    return cityDataList.find((c) => c.name_ar === selectedCity || c.name_fr === selectedCity) || activeCityDetail;
  }, [selectedCity, cityDataList, activeCityDetail]);

  // Render SVG Map using D3
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !geojsonRegions.features.length) return;

    const width = 960;
    const height = 620;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Map container group
    const g = svg.append('g').attr('class', 'map-root');

    // Geo Projection tuned for Morocco (including Southern Provinces)
    const projection = d3
      .geoMercator()
      .center([-7.5, 29.5])
      .scale(2100)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom behavior: require two fingers on touch or Ctrl/Meta+wheel so single-finger vertical page scroll is never trapped
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [-100, -100],
        [width + 100, height + 100],
      ])
      .filter((event) => {
        if (event.type === 'wheel') return event.ctrlKey || event.metaKey;
        if (event.type === 'touchstart' || event.type === 'touchmove') {
          return event.touches && event.touches.length >= 2;
        }
        return !event.ctrlKey && !event.button;
      })
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Ocean / Background styling
    g.append('rect')
      .attr('width', width * 3)
      .attr('height', height * 3)
      .attr('x', -width)
      .attr('y', -height)
      .attr('fill', '#FAF7F2')
      .attr('opacity', 0.8);

    // Render Moroccan Regions
    const regionsGroup = g.append('g').attr('class', 'regions-group');

    regionsGroup
      .selectAll('path')
      .data(geojsonRegions.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        const regionNameAr = d.properties?.['name:ar'] || '';
        // If hovered
        if (hoveredRegion && hoveredRegion.name_ar === regionNameAr) {
          return '#D7E8DF';
        }
        return '#EDE6DA';
      })
      .attr('stroke', '#C8BDAB')
      .attr('stroke-width', 1)
      .attr('class', 'transition-colors duration-150 cursor-pointer')
      .on('mouseenter', (_event, d: any) => {
        const regionAr = d.properties?.['name:ar'] || '';
        const regionFr = d.properties?.['name:en'] || regionAr;
        // Count institutions in this region
        const count = cityDataList
          .filter((c) => c.region_ar === regionAr || c.region_fr === regionFr)
          .reduce((sum, c) => sum + c.universities.length + c.institutions.length, 0);

        setHoveredRegion({
          id: d.properties?.name || regionAr,
          name_ar: regionAr,
          name_fr: regionFr,
          count,
        });
      })
      .on('mouseleave', () => {
        setHoveredRegion(null);
      });

    // Render Academic Hub Markers
    const hubsGroup = g.append('g').attr('class', 'academic-hubs-group');

    cityDataList.forEach((city) => {
      const projected = projection(city.coords);
      if (!projected) return;
      const [x, y] = projected;
      const totalCount = city.universities.length + city.institutions.length;
      const hasUniversity = city.universities.length > 0;
      const isSelected = selectedCity === city.name_ar || selectedCity === city.name_fr;

      const hubNode = hubsGroup
        .append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .attr('class', 'cursor-pointer')
        .on('click', (event) => {
          event.stopPropagation();
          onSelectCity(city.name_ar);
          setActiveCityDetail(city);
        })
        .on('mouseenter', () => {
          setHoveredCity(city);
        })
        .on('mouseleave', () => {
          setHoveredCity(null);
        });

      // Pulsing outer ring for active / selected hub
      if (isSelected || hasUniversity) {
        hubNode
          .append('circle')
          .attr('r', isSelected ? 16 : 12)
          .attr('fill', hasUniversity ? '#143D30' : '#B43425')
          .attr('opacity', isSelected ? 0.25 : 0.15)
          .attr('class', isSelected ? 'animate-pulse' : '');
      }

      // Main pin circle
      hubNode
        .append('circle')
        .attr('r', isSelected ? 11 : 9)
        .attr('fill', hasUniversity ? '#143D30' : '#B43425')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2)
        .attr('class', 'shadow-md transition-all duration-200');

      // Count number inside circle
      hubNode
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text(totalCount);

      // Smart directional label offsets to prevent nearby city names from colliding
      const labelOffsets: Record<string, { dx: number; dy: number; anchor: string }> = {
        'طنجة': { dx: -10, dy: -12, anchor: 'end' },
        'تطوان': { dx: 12, dy: 4, anchor: 'start' },
        'القنيطرة': { dx: 12, dy: -8, anchor: 'start' },
        'الرباط': { dx: -13, dy: 3, anchor: 'end' },
        'الدار البيضاء': { dx: -13, dy: 6, anchor: 'end' },
        'الجديدة': { dx: -12, dy: 12, anchor: 'end' },
        'سطات': { dx: 12, dy: 12, anchor: 'start' },
        'خريبكة': { dx: 12, dy: 4, anchor: 'start' },
        'مكناس': { dx: -12, dy: 14, anchor: 'end' },
        'فاس': { dx: 12, dy: -6, anchor: 'start' },
        'أكادير': { dx: -12, dy: 4, anchor: 'end' },
        'تارودانت': { dx: 12, dy: 8, anchor: 'start' },
      };
      const offset = labelOffsets[city.name_ar] || { dx: 0, dy: 19, anchor: 'middle' };

      // City label with halo stroke for crisp contrast over borders/markers
      hubNode
        .append('text')
        .attr('text-anchor', offset.anchor)
        .attr('x', offset.dx)
        .attr('y', offset.dy)
        .attr('fill', isSelected ? '#143D30' : '#2D2823')
        .attr('stroke', '#FAF7F2')
        .attr('stroke-width', 3.5)
        .attr('paint-order', 'stroke')
        .attr('font-size', isSelected ? '12px' : '10.5px')
        .attr('font-weight', isSelected ? '800' : '600')
        .attr('class', 'pointer-events-none select-none')
        .text(isAr ? city.name_ar : city.name_fr);
    });
  }, [geojsonRegions, cityDataList, selectedCity, hoveredRegion, isAr, onSelectCity]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.4);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    onSelectCity('all');
    setActiveCityDetail(null);
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(400)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#FAF7F2] rounded-2xl border border-stone-200 overflow-hidden shadow-xs relative flex flex-col"
    >
      {/* Top Map Strip Header */}
      <div className="p-4 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#143D30] text-emerald-100 flex items-center justify-center font-bold text-xs shrink-0">
            <Compass className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
              {isAr ? 'الخريطة التفاعلية للأقطاب والجهات الجامعية' : 'Carte interactive des pôles universitaires'}
            </h3>
            <p className="text-[11px] text-stone-500">
              {isAr ? 'انقر على أي قطب لاستكشاف المؤسسات والاتجاهات' : 'Cliquez sur un pôle pour explorer'}
            </p>
          </div>
        </div>

        {/* City Filter Dropdown & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCity}
            onChange={(e) => {
              onSelectCity(e.target.value);
              const found = cityDataList.find((c) => c.name_ar === e.target.value || c.name_fr === e.target.value);
              setActiveCityDetail(found || null);
            }}
            className="flex-1 sm:flex-initial min-h-[40px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none"
            aria-label="اختر قطباً جامعياً للتكبير"
          >
            <option value="all">{isAr ? 'جميع المدن والأقطاب' : 'Toutes les villes'}</option>
            {cityDataList.map((c) => (
              <option key={c.id} value={c.name_ar}>
                {isAr ? c.name_ar : c.name_fr} ({c.universities.length + c.institutions.length})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetZoom}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-lg bg-stone-50 hover:bg-stone-200 text-stone-600 border border-stone-300 transition-colors shrink-0"
            title={isAr ? 'إعادة ضبط الخريطة' : 'Réinitialiser'}
            aria-label="إعادة ضبط الخريطة"
          >
            <RotateCcw className="w-4 h-4 text-stone-700" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[280px] sm:h-[440px] md:h-[520px] bg-[#FAF7F2] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 960 620"
          style={{ touchAction: 'pan-y' }}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        />

        {/* Zoom Controls Overlay (Top-End) */}
        <div className="absolute top-3 end-3 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-stone-300 shadow-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 hover:bg-stone-100 text-stone-800 rounded-lg transition-colors"
            title={isAr ? 'تكبير' : 'Zoom avant'}
            aria-label="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 hover:bg-stone-100 text-stone-800 rounded-lg transition-colors"
            title={isAr ? 'تصغير' : 'Zoom arrière'}
            aria-label="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 hover:bg-stone-100 text-stone-800 rounded-lg transition-colors border-t border-stone-200"
            title={isAr ? 'إعادة ضبط' : 'Réinitialiser'}
            aria-label="إعادة ضبط"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Hovered Region Badge Overlay (Hidden when desktop drawer occupies start slot) */}
        {hoveredRegion && !currentActiveCity && (
          <div className="absolute top-3 start-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200 shadow-md pointer-events-none text-xs max-w-[65%]">
            <span className="font-bold text-stone-900 block truncate">
              {isAr ? hoveredRegion.name_ar : hoveredRegion.name_fr}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              {isAr
                ? `${hoveredRegion.count} مؤسسة وكلية بالجهة`
                : `${hoveredRegion.count} établissements dans la région`}
            </span>
          </div>
        )}

        {/* Map Legend (Bottom-End, cleanly separated from Start city drawer) */}
        <div className="absolute bottom-3 end-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200/90 shadow-md text-xs space-y-1 max-w-[215px] sm:max-w-none">
          <div className="font-bold text-stone-800 text-[11px] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#143D30] shrink-0" />
            <span>{isAr ? 'دليل رموز الخريطة' : 'Légende'}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600 text-[10px] sm:text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#143D30] border border-white shrink-0"></span>
            <span className="truncate">{isAr ? 'قطب جامعي (جامعة عمومية)' : 'Pôle universitaire'}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600 text-[10px] sm:text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B43425] border border-white shrink-0"></span>
            <span className="truncate">{isAr ? 'مدارس وكليات ومعاهد' : 'Écoles & facultés'}</span>
          </div>
        </div>

        {/* Active City Details Drawer on Desktop (md+ docked at Start so it never overlaps Zoom/Legend at End) */}
        {currentActiveCity && (
          <div className="hidden md:flex md:absolute md:top-3 md:start-3 md:bottom-3 md:z-20 md:w-80 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#143D30]" />
                  <h4 className="font-bold text-sm text-stone-900">
                    {isAr ? currentActiveCity.name_ar : currentActiveCity.name_fr}
                  </h4>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {isAr ? currentActiveCity.region_ar : currentActiveCity.region_fr}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveCityDetail(null);
                  onSelectCity('all');
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
                aria-label="إغلاق تفاصيل القطب"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Universities & Institutions in City */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              {currentActiveCity.universities.length > 0 && (
                <div>
                  <span className="font-bold text-stone-700 block mb-1 text-[11px] uppercase">
                    {isAr
                      ? `الجامعات الأم (${currentActiveCity.universities.length})`
                      : `Universités (${currentActiveCity.universities.length})`}
                  </span>
                  <div className="space-y-1.5">
                    {currentActiveCity.universities.map((u) => {
                      const uCoords = getCoordinates(u, 'university');
                      const directionsUrl = getOpenStreetMapDirectionsUrl(uCoords.lat, uCoords.lng);

                      return (
                        <div
                          key={u.id}
                          className="p-2.5 bg-stone-50 hover:bg-emerald-50/60 rounded-xl border border-stone-200 flex items-center justify-between gap-2 transition-colors"
                        >
                          <div className="min-w-0">
                            <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {u.code}
                            </span>
                            <h5 className="font-semibold text-stone-900 text-xs truncate mt-1">
                              {isAr ? u.name_ar : u.name_fr}
                            </h5>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-[#143D30] border border-stone-300"
                              title={isAr ? 'الاتجاهات ومسار التنقل' : 'Itinéraire'}
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => onSelectUniversity(u)}
                              className="px-2 py-1 bg-[#143D30] text-white rounded-lg text-[11px] font-medium hover:bg-[#0f2e24]"
                            >
                              {t.view_details}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentActiveCity.institutions.length > 0 && (
                <div>
                  <span className="font-bold text-stone-700 block mb-1 text-[11px] uppercase">
                    {isAr
                      ? `المؤسسات والكليات (${currentActiveCity.institutions.length})`
                      : `Établissements (${currentActiveCity.institutions.length})`}
                  </span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pe-1">
                    {currentActiveCity.institutions.map((inst) => {
                      const iCoords = getCoordinates(inst, 'institution');
                      const directionsUrl = getOpenStreetMapDirectionsUrl(iCoords.lat, iCoords.lng);

                      return (
                        <div
                          key={inst.id}
                          className="p-2 bg-stone-50 hover:bg-amber-50/60 rounded-xl border border-stone-200 flex items-center justify-between gap-2 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-stone-800 bg-stone-200 px-1 py-0.5 rounded">
                                {inst.code}
                              </span>
                              <span className="text-[10px] text-stone-500 font-medium truncate">
                                {isAr
                                  ? inst.admission_type === 'regulated' ? 'مباراة' : 'مفتوح'
                                  : inst.admission_type === 'regulated' ? 'Concours' : 'Ouvert'}
                              </span>
                            </div>
                            <h5 className="font-medium text-stone-900 text-xs truncate mt-0.5">
                              {isAr ? inst.name_ar : inst.name_fr}
                            </h5>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300"
                              title={isAr ? 'الاتجاهات ومسار التنقل' : 'Itinéraire'}
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => onSelectInstitution(inst)}
                              className="px-2 py-1 bg-stone-200 text-stone-800 hover:bg-[#143D30] hover:text-white rounded-lg text-[11px] font-medium transition-colors"
                            >
                              {t.view_details}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Filter Trigger */}
            <div className="p-3 bg-stone-50 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  onSelectCity(currentActiveCity.name_ar);
                  const el = document.getElementById('directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 px-3 bg-[#143D30] hover:bg-[#0f2e24] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>
                  {isAr
                    ? `تصفية الدليل لكافة مؤسسات ${currentActiveCity.name_ar}`
                    : `Filtrer l’annuaire pour ${currentActiveCity.name_fr}`}
                </span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active City Details Stacked Card on Mobile (< md) so it never covers the map canvas */}
      {currentActiveCity && (
        <div className="md:hidden bg-white border-t border-stone-200 flex flex-col animate-in fade-in duration-150">
          <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#143D30] shrink-0" />
                <h4 className="font-bold text-sm text-stone-900 truncate">
                  {isAr ? currentActiveCity.name_ar : currentActiveCity.name_fr}
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                {isAr ? currentActiveCity.region_ar : currentActiveCity.region_fr}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCityDetail(null);
                onSelectCity('all');
              }}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors shrink-0"
              aria-label="إغلاق تفاصيل القطب"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 text-xs max-h-72 overflow-y-auto">
            {currentActiveCity.universities.map((u) => (
              <div
                key={u.id}
                className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {u.code}
                  </span>
                  <h5 className="font-semibold text-stone-900 text-xs truncate mt-1">
                    {isAr ? u.name_ar : u.name_fr}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectUniversity(u)}
                  className="px-3 py-1.5 min-h-[36px] bg-[#143D30] text-white rounded-lg text-[11px] font-medium shrink-0"
                >
                  {t.view_details}
                </button>
              </div>
            ))}

            {currentActiveCity.institutions.map((inst) => (
              <div
                key={inst.id}
                className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-stone-800 bg-stone-200 px-1.5 py-0.5 rounded">
                      {inst.code}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {isAr
                        ? inst.admission_type === 'regulated' ? 'مباراة' : 'مفتوح'
                        : inst.admission_type === 'regulated' ? 'Concours' : 'Ouvert'}
                    </span>
                  </div>
                  <h5 className="font-medium text-stone-900 text-xs truncate mt-0.5">
                    {isAr ? inst.name_ar : inst.name_fr}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectInstitution(inst)}
                  className="px-3 py-1.5 min-h-[36px] bg-stone-200 text-stone-800 rounded-lg text-[11px] font-medium shrink-0"
                >
                  {t.view_details}
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-50 border-t border-stone-200">
            <button
              type="button"
              onClick={() => {
                onSelectCity(currentActiveCity.name_ar);
                const el = document.getElementById('directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full min-h-[42px] py-2 px-3 bg-[#143D30] hover:bg-[#0f2e24] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>
                {isAr
                  ? `تصفية الدليل لكافة مؤسسات ${currentActiveCity.name_ar}`
                  : `Filtrer l’annuaire pour ${currentActiveCity.name_fr}`}
              </span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useChartContext } from "@/CodeBehind/Components/Charts/useChartContext";
import ChartFileSelectionDropdown from "@/components/Dashboard/Charts/ChartFileSelectionDropdown";
import FrequencyChart from "@/components/Dashboard/Charts/FrequencyChart";
import { FileColumns } from "@/lib/Database/Enums/FileColumns";
import { Button, Text } from "@radix-ui/themes";
import { useMemo } from "react";

export default function Charts() {

  const {
    csvData,
    folders,
    selectedFolderId,
    selectedFileId,
    files,
    loading,
    error,
    setSelectedFileId,
    setSelectedFolderId

  } = useChartContext();


  const chartData = useMemo(() => {
    if (!csvData?.length) return [];

    const MAX_POINTS = 1500;
    if (csvData.length <= MAX_POINTS) {
      const minPositive = csvData.reduce((min, d) => (d.mag > 0 ? Math.min(min, d.mag) : min), Infinity);
      const floor = Number.isFinite(minPositive) ? minPositive : 1e-12;
      return csvData.map((d) => ({ ...d, mag: d.mag > 0 ? d.mag : floor }));
    }

    const step = Math.ceil(csvData.length / MAX_POINTS);
    const out: { freq: number; mag: number }[] = [];

    for (let i = 0; i < csvData.length; i += step) {
      const end = Math.min(i + step, csvData.length);
      let maxMag = -Infinity;
      for (let j = i; j < end; j++) {
        const m = csvData[j].mag;
        if (m > maxMag) maxMag = m;
      }

      const mid = i + Math.floor((end - i) / 2);
      out.push({ freq: csvData[mid].freq, mag: Number.isFinite(maxMag) ? maxMag : 0 });
    }

    const minPositive = out.reduce((min, d) => (d.mag > 0 ? Math.min(min, d.mag) : min), Infinity);
    const floor = Number.isFinite(minPositive) ? minPositive : 1e-12;
    return out.map((d) => ({ ...d, mag: d.mag > 0 ? d.mag : floor }));
  }, [csvData]);

  return (
    <div className="flex flex-col gap-3 px-3 ">
      <ChartFileSelectionDropdown
        folders={folders}
        files={files}
        folderId={selectedFolderId}
        fileId={selectedFileId}
        setFolderId={setSelectedFolderId}
        setFileId={setSelectedFileId}
      />

      {
        loading ? <Text>Loading</Text> : <></>
      }

      {
        selectedFileId ?
          <div className="w-full h-[600px]">
            <FrequencyChart freqData={chartData} height={600} />
          </div >
          : <></>
      }
    </div>
  );


}

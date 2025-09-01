import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, FileSpreadsheet, Download, Upload, Filter, SortAsc, SortDesc, Eye, EyeOff, X } from 'lucide-react';

interface DataAsset {
  id: string;
  name: string;
  type: 'spreadsheet' | 'csv' | 'json' | 'database';
  size: string;
  lastModified: string;
  data: any[];
  columns: string[];
  color: string;
}

interface DataAssetEditorProps {
  asset: DataAsset;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAsset: (updatedAsset: Partial<DataAsset>) => void;
}

export function DataAssetEditor({ asset, isOpen, onClose, onUpdateAsset }: DataAssetEditorProps) {
  const [localData, setLocalData] = useState<any[]>(asset.data);
  const [localColumns, setLocalColumns] = useState<string[]>(asset.columns);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  useEffect(() => {
    setLocalData(asset.data);
    setLocalColumns(asset.columns);
    setHasChanges(false);
  }, [asset]);

  const handleCellEdit = (rowIndex: number, column: string, value: string) => {
    const newData = [...localData];
    newData[rowIndex] = { ...newData[rowIndex], [column]: value };
    setLocalData(newData);
    setHasChanges(true);
    setEditingCell(null);
  };

  const handleAddRow = () => {
    const newRow: any = {};
    localColumns.forEach(col => newRow[col] = '');
    setLocalData([...localData, newRow]);
    setHasChanges(true);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = localData.filter((_, index) => index !== rowIndex);
    setLocalData(newData);
    setHasChanges(true);
  };

  const handleAddColumn = () => {
    const newColumnName = `Column ${localColumns.length + 1}`;
    const newColumns = [...localColumns, newColumnName];
    const newData = localData.map(row => ({ ...row, [newColumnName]: '' }));
    setLocalColumns(newColumns);
    setLocalData(newData);
    setHasChanges(true);
  };

  const handleDeleteColumn = (columnName: string) => {
    const newColumns = localColumns.filter(col => col !== columnName);
    const newData = localData.map(row => {
      const { [columnName]: deleted, ...rest } = row;
      return rest;
    });
    setLocalColumns(newColumns);
    setLocalData(newData);
    setHasChanges(true);
  };

  const handleRenameColumn = (oldName: string, newName: string) => {
    if (newName && newName !== oldName && !localColumns.includes(newName)) {
      const newColumns = localColumns.map(col => col === oldName ? newName : col);
      const newData = localData.map(row => ({
        ...Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key === oldName ? newName : key, value])
        )
      }));
      setLocalColumns(newColumns);
      setLocalData(newData);
      setHasChanges(true);
    }
  };

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });

    const sortedData = [...localData].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setLocalData(sortedData);
  };

  const toggleColumnVisibility = (column: string) => {
    setHiddenColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const handleSave = () => {
    const updatedAsset = {
      data: localData,
      columns: localColumns,
      size: `${(JSON.stringify(localData).length / 1024).toFixed(1)} KB`
    };
    onUpdateAsset(updatedAsset);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalData(asset.data);
    setLocalColumns(asset.columns);
    setHasChanges(false);
    setEditingCell(null);
  };

  if (!isOpen) return null;

  const visibleColumns = localColumns.filter(col => !hiddenColumns.includes(col));

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-white shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-3 h-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to canvas
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="title-large text-foreground">{asset.name}</h1>
                <p className="body-small text-muted-foreground">Spreadsheet Editor</p>
              </div>
              <Badge 
                variant={hasChanges ? "default" : "secondary"} 
                className={`rounded-full ${hasChanges ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {hasChanges ? "Modified" : "Saved"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full px-4 h-10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full px-4 h-10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset} 
              disabled={!hasChanges}
              className="rounded-full px-4 h-10 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="rounded-full px-4 h-10 disabled:opacity-50 bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 body-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{localData.length} rows</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/70"></div>
                <span>{localColumns.length} columns</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                <span>{(JSON.stringify(localData).length / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddRow}
              className="rounded-full px-4 h-10 hover:bg-primary/10 hover:border-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddColumn}
              className="rounded-full px-4 h-10 hover:bg-primary/10 hover:border-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full px-4 h-10 hover:bg-primary/10 hover:border-primary"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Column Visibility Controls */}
        {hiddenColumns.length > 0 && (
          <div className="p-4 border-b border-border bg-primary/10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="body-medium text-foreground">Hidden columns:</span>
              <div className="flex flex-wrap gap-2">
                {hiddenColumns.map(col => (
                  <Badge 
                    key={col} 
                    variant="outline" 
                    className="rounded-full cursor-pointer hover:bg-primary/20 border-primary/30 text-foreground" 
                    onClick={() => toggleColumnVisibility(col)}
                  >
                    {col}
                    <EyeOff className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-white">
          <ScrollArea className="h-full">
            <div className="p-6 bg-white">
              <Card className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-border">
                      <TableHead className="w-16 text-center title-small text-muted-foreground">#</TableHead>
                      {visibleColumns.map((column) => (
                        <TableHead key={column} className="min-w-[150px] relative group">
                          <div className="flex items-center gap-2">
                            <Input
                              defaultValue={column}
                              className="border-none bg-transparent p-0 h-auto title-small text-foreground font-medium focus:ring-2 focus:ring-primary rounded-lg"
                              onBlur={(e) => handleRenameColumn(column, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-opacity"
                                onClick={() => handleSort(column)}
                              >
                                {sortConfig?.key === column ? (
                                  sortConfig.direction === 'asc' ? (
                                    <SortAsc className="w-4 h-4 text-primary" />
                                  ) : (
                                    <SortDesc className="w-4 h-4 text-primary" />
                                  )
                                ) : (
                                  <SortAsc className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-opacity"
                                onClick={() => toggleColumnVisibility(column)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-opacity"
                                onClick={() => handleDeleteColumn(column)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localData.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="group hover:bg-muted/30 border-border">
                        <TableCell className="text-center body-medium text-muted-foreground relative">
                          {rowIndex + 1}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-opacity"
                            onClick={() => handleDeleteRow(rowIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        {visibleColumns.map((column) => (
                          <TableCell key={column} className="p-2">
                            {editingCell?.row === rowIndex && editingCell?.col === column ? (
                              <Input
                                defaultValue={row[column]?.toString() || ''}
                                className="w-full h-10 rounded-lg border body-large"
                                autoFocus
                                onBlur={(e) => handleCellEdit(rowIndex, column, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleCellEdit(rowIndex, column, e.currentTarget.value);
                                  } else if (e.key === 'Escape') {
                                    setEditingCell(null);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className="p-3 min-h-[44px] cursor-text hover:bg-muted/20 rounded-lg transition-colors body-large text-foreground flex items-center"
                                onClick={() => setEditingCell({ row: rowIndex, col: column })}
                              >
                                {row[column]?.toString() || ''}
                              </div>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="body-small text-foreground">Ready</span>
            </div>
            {hasChanges && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/70"></div>
                <span className="body-small text-primary">Unsaved changes</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 body-small text-muted-foreground">
            <span>Last modified: {asset.lastModified}</span>
            <span>Size: {asset.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
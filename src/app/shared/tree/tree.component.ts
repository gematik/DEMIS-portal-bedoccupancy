/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export class FlatStepNode {
  constructor(
    public name: string,
    public isExpandable: boolean,
    public level: number,
    public invalid?: boolean,
    public link?: string,
    public disabled?: boolean
  ) {}
}

export interface StepNode {
  name: string;
  children?: StepNode[];
  link?: string;
  invalid?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit, OnChanges {
  @Input() treeData!: StepNode[];

  treeControl: FlatTreeControl<FlatStepNode>; // = new NestedTreeControl<StepNode>(node => node.children);
  treeFlattener: MatTreeFlattener<StepNode, FlatStepNode>;
  dataSource: MatTreeFlatDataSource<StepNode, FlatStepNode>; // = new MatTreeNestedDataSource<StepNode>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.treeFlattener = new MatTreeFlattener<StepNode, FlatStepNode>(
      (node: StepNode, level: number): FlatStepNode => {
        const isExpandable: boolean = !!node.children && node.children?.length > 0;
        return new FlatStepNode(node.name, isExpandable, level, node.invalid, node.link, node.disabled);
      },
      node => node.level,
      node => node.isExpandable,
      node => node.children
    );
    this.treeControl = new FlatTreeControl<FlatStepNode>(
      dataNode => dataNode.level,
      dataNode => dataNode.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource<StepNode, FlatStepNode>(this.treeControl, this.treeFlattener);
  }

  // hasChild = (_: number, node: StepNode) => !!node.children && node.children.length > 0;
  hasChild = (_: number, node: FlatStepNode) => node.isExpandable;

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.expandActiveNode();
    });
  }

  setIdName(type: string, link: string): string {
    return type + '-' + link.toLocaleLowerCase().split(' ').join('-');
  }

  private getParent(node: FlatStepNode): FlatStepNode | null | undefined {
    const nodeIndex = this.treeControl.dataNodes.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < node.level) {
        return currentNode;
      }
    }
    return null;
  }

  public isChildActive(node: FlatStepNode): boolean {
    const nodeIndex = this.treeControl.dataNodes.indexOf(node);
    for (let i = nodeIndex + 1; i < this.treeControl.dataNodes.length; i++) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level > node.level) {
        if (currentNode.link) {
          if (this.isActiveLink(currentNode.link)) {
            return true;
          }
        }
      } else {
        return false;
      }
    }
    return false;
  }

  public isActiveLink(link: string): boolean {
    const parsedUrl = this.router.createUrlTree([
      ...this.route.snapshot.parent!.url.map(u => u.path),
      ...this.route.snapshot.url.map(u => u.path),
      // ...this.router.parseUrl(link).root.children.primary.segments.map(u => u.path)
      // ...link.split('/')
    ]);
    return this.router.isActive(parsedUrl, true);
  }

  private getActiveNode(): FlatStepNode | undefined {
    return this.treeControl.dataNodes.find(n => {
      if (n.link) {
        return this.isActiveLink(n.link);
      }
      return false;
    });
  }

  expandActiveNode() {
    const activeNode = this.getActiveNode();
    if (activeNode) this.expandParentDescendants(activeNode);
  }

  expandParentDescendants(activeNode: FlatStepNode) {
    const parentNode = this.getParent(activeNode);
    if (parentNode) {
      this.treeControl.expandDescendants(parentNode);
      if (parentNode.level > 0) {
        this.expandParentDescendants(parentNode);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['treeData']) {
      this.dataSource.data = this.treeData;
      this.expandActiveNode();
    }
  }
}
